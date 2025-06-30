import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Removed ToastContainer import as it's in App.js

// Helper function to build a nested reply tree from a flat list
// This function is crucial for rendering nested comments
const buildReplyTree = (replies) => {
    const replyMap = new Map();
    const rootReplies = [];

    // First pass: map replies by their _id and initialize children array
    replies.forEach(reply => {
        replyMap.set(reply._id, { ...reply, children: [] });
    });

    // Second pass: assign children to their parents or to rootReplies
    replyMap.forEach(reply => {
        if (reply.parentReply) {
            const parent = replyMap.get(reply.parentReply);
            if (parent) {
                parent.children.push(reply);
            } else {
                // If parentReply is set but parent not found (e.g., deleted parent),
                // treat as a root reply or handle as an error. For now, add to root.
                // This scenario should ideally be rare if data integrity is maintained.
                rootReplies.push(reply);
            }
        } else {
            rootReplies.push(reply);
        }
    });

    // Sort children by createdAt within each level for consistent order
    const sortChildren = (replyNode) => {
        replyNode.children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        replyNode.children.forEach(sortChildren);
    };

    rootReplies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort root replies
    rootReplies.forEach(sortChildren); // Recursively sort all children

    return rootReplies;
};


// Component: ReplyItem for rendering individual replies and their nested children
const ReplyItem = ({ reply, postId, onReplySubmit, replyText, setReplyText, depth = 0 }) => {
    const isOwner = localStorage.getItem('userId') === reply.repliedBy?._id;
    // Calculate indentation based on depth
    // Max depth is arbitrary, consider a visual limit to prevent excessive indentation
    const paddingLeft = `${Math.min(16 + depth * 20, 100)}px`; // Limit max padding to 100px for extremely deep nests

    return (
        <div style={{ paddingLeft }} className={`py-3 pr-2 border-l-2 ${depth % 2 === 0 ? 'border-blue-300 bg-blue-50' : 'border-purple-300 bg-purple-50'} rounded-r-md mb-2`}>
            <p className="text-gray-800 break-words">{reply.text}</p>
            <p className="text-xs text-gray-500 mt-1">
                — <span className="font-medium">{isOwner ? 'You' : reply.repliedBy?.name || 'Anonymous'}</span>
                {reply.createdAt && (
                    <span className="ml-2 text-gray-400">
                        ({new Date(reply.createdAt).toLocaleString()})
                    </span>
                )}
            </p>
            <div className="mt-3 flex flex-col gap-2"> {/* Added flex-col and gap for input/button */}
                <input
                    className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="Reply to this comment..."
                    value={replyText[reply._id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [reply._id]: e.target.value })}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onReplySubmit(reply._id, e.target.value); // Pass parentReplyId
                            e.preventDefault(); // Prevent new line in input
                        }
                    }}
                />
                <button
                    onClick={() => onReplySubmit(reply._id, replyText[reply._id])} // Pass parentReplyId
                    className="self-end text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out shadow-sm font-semibold"
                >
                    Add Reply
                </button>
            </div>

            {/* Recursively render children replies */}
            {reply.children.length > 0 && (
                <div className="mt-2 border-t border-gray-100 pt-2">
                    {reply.children.map(childReply => (
                        <ReplyItem
                            key={childReply._id}
                            reply={childReply}
                            postId={postId} 
                            onReplySubmit={onReplySubmit}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const Backlog = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", description: "" });
    const [replyText, setReplyText] = useState({}); // Stores reply text for each post/reply ID
    const [viewMyPosts, setViewMyPosts] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // useRef to store previous myPosts replies lengths for comparison (for new replies notification)
    const prevMyPostsReplyCounts = useRef({});

    // Get current user ID from localStorage
    // Ensure 'userId' is consistently stored and retrieved here.
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (viewMyPosts) {
                await fetchMyPosts();
            } else {
                await fetchAllPosts();
            }
            setIsLoading(false);
        };
        fetchData();
    }, [viewMyPosts]);


    const fetchPostsAndReplies = async (fetchUrl) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const resPosts = await api.get(fetchUrl, { headers });
            const fetchedPosts = resPosts.data;

            // Fetch all replies for all fetched posts concurrently
            const replyPromises = fetchedPosts.map(async post => {
                const resReplies = await api.get(`/api/backlog/${post._id}/replies`, { headers });
                // Attach flat replies array to the post object temporarily
                return { ...post, rawReplies: resReplies.data };
            });

            const postsWithRawReplies = await Promise.all(replyPromises);

            // Process replies into nested structure for each post
            const postsWithNestedReplies = postsWithRawReplies.map(post => ({
                ...post,
                replies: buildReplyTree(post.rawReplies), // Use the helper to build tree
            }));

            // Logic for reply notifications on MY posts
            if (fetchUrl === "/backlog/me") {
                postsWithNestedReplies.forEach(newPostData => {
                    const postId = newPostData._id;
                    // Count total replies (including nested) for the post
                    const newTotalReplyCount = newPostData.rawReplies.length;
                    const oldTotalReplyCount = prevMyPostsReplyCounts.current[postId] || 0;

                    if (newTotalReplyCount > oldTotalReplyCount) {
                        // Find the latest reply based on creation date
                        const latestReply = newPostData.rawReplies.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))[newTotalReplyCount - 1];
                        if (latestReply) { // Ensure latestReply exists
                            const replierName = latestReply.repliedBy?.name || 'Someone';
                            // Determine if it's a reply to a post or a reply to a comment
                            const notificationMessage = latestReply.parentReply
                                ? `${replierName} replied to a comment on your request: "${newPostData.title}"`
                                : `${replierName} replied to your request: "${newPostData.title}"`;
                            toast.info(`📬 ${notificationMessage}`);
                        }
                    }
                });

                // Update previous counts for the next comparison
                const nextReplyCountsState = {};
                postsWithNestedReplies.forEach(post => {
                    nextReplyCountsState[post._id] = post.rawReplies.length;
                });
                prevMyPostsReplyCounts.current = nextReplyCountsState;
            }

            return postsWithNestedReplies;

        } catch (err) {
            console.error("Error fetching posts and replies:", err);
            toast.error("Failed to load requests.");
            if (err.response && err.response.status === 401) {
                navigate("/login");
            }
            return [];
        }
    };

    const fetchAllPosts = async () => {
        const posts = await fetchPostsAndReplies("/backlog");
        setAllPosts(posts);
    };

    const fetchMyPosts = async () => {
        const posts = await fetchPostsAndReplies("/backlog/me");
        setMyPosts(posts);
    };


    const createPost = async (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.description.trim()) {
            toast.warn("Please enter both a title and description for your request.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await api.post("/api/backlog", newPost, { headers: { Authorization: `Bearer ${token}` } });

            // Since replies are fetched separately now, we'll add the new post
            // and then refetch my posts to ensure replies are loaded if any are added immediately (unlikely)
            // or just ensure the post appears correctly.
            const newPostWithEmptyReplies = { ...response.data, replies: [], rawReplies: [] }; // Include rawReplies for consistency
            setMyPosts(prevMyPosts => [newPostWithEmptyReplies, ...prevMyPosts]);

            // Initialize reply count for the new post
            prevMyPostsReplyCounts.current = {
                ...prevMyPostsReplyCounts.current,
                [newPostWithEmptyReplies._id]: 0
            };

            setNewPost({ title: "", description: "" });
            toast.success("Your request for help has been posted!");
            // No need to fetchAllPosts immediately unless the community view needs instant update
            // and you expect users to switch immediately. For now, rely on its own fetch.
        } catch (err) {
            console.error("Error creating post:", err);
            toast.error("Failed to post request. Please try again.");
        }
    };


    // MODIFIED: replyTo now accepts parentId, which can be a postId or a replyId
    const replyTo = async (parentId, text) => {
        if (!text?.trim()) {
            toast.warn("Reply cannot be empty.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            let endpoint;

            // Determine if parentId is a postId (for top-level reply) or a replyId (for nested reply)
            // This check needs to be robust. Check if parentId exists in either myPosts or allPosts as a post _id.
            const isParentAPost = myPosts.some(p => p._id === parentId) || allPosts.some(p => p._id === parentId);

            if (isParentAPost) {
                // This is a top-level reply to a post
                endpoint = `/backlog/${parentId}/replies`;
            } else {
                // This is a nested reply to an existing reply (parentId is a reply._id)
                endpoint = `/backlog/reply/${parentId}/replies`;
            }

            await api.post(endpoint, { text: text }, { headers: { Authorization: `Bearer ${token}` } });

            setReplyText((prev) => ({ ...prev, [parentId]: "" })); // Clear specific input field

            // After a reply is successfully made, re-fetch posts/replies to update the UI
            // This ensures the new reply (and potentially its children) are rendered.
            if (viewMyPosts) {
                fetchMyPosts();
            } else {
                fetchAllPosts();
            }
            toast.success("Reply added!");
        } catch (err) {
            console.error("Error adding reply:", err);
            // --- ENHANCED ERROR LOGGING ---
            if (err.response) {
                console.error("Backend Response Status:", err.response.status);
                console.error("Backend Response Data:", err.response.data);
                toast.error(`Failed to add reply: ${err.response.data.message || 'Server error'}`);
            } else if (err.request) {
                console.error("No response received from server:", err.request);
                toast.error("Failed to add reply: No response from server.");
            } else {
                console.error("Error setting up request:", err.message);
                toast.error("Failed to add reply: Request setup error.");
            }
            // --- END ENHANCED ERROR LOGGING ---
        }
    };

    const toggleUpvote = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(`/api/backlog/upvote/${postId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

            // Re-fetch posts to reflect the upvote change
            // This will also trigger the reply fetching and tree building
            if (viewMyPosts) {
                fetchMyPosts();
            } else {
                fetchAllPosts();
            }
            toast.info("Upvote updated!");
        } catch (err) {
            console.error("Error upvoting:", err);
            toast.error("Failed to upvote. Please try again.");
        }
    };

    const renderPostCard = (post, isMyPost = false) => {
        const hasUpvoted = post.upvotes.includes(currentUserId);
        return (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200"> {/* Stronger shadow */}
                <h4 className="font-extrabold text-2xl text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-700 leading-relaxed mb-4 text-base">{post.description}</p> {/* Increased bottom margin */}
                <p className="text-sm text-gray-500 mb-4">
                    By: <span className="font-semibold text-gray-700">{isMyPost ? 'You' : post.createdBy?.name || 'Anonymous'}</span>
                    {post.createdAt && (
                        <span className="ml-2 text-gray-400 text-xs">
                            on {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                        </span>
                    )}
                </p>

                <button
                    onClick={() => toggleUpvote(post._id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition duration-150 ease-in-out shadow-md
                        ${hasUpvoted ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"}`}
                >
                    👍 Upvotes: {post.upvotes.length}
                </button>

                {/* Replies Section */}
                <div className="mt-6 pt-5 border-t border-gray-200"> {/* More top margin and border */}
                    <h5 className="font-bold text-gray-700 mb-4 text-lg">
                        Offers of Help ({post.rawReplies ? post.rawReplies.length : 0}):
                    </h5>
                    {post.replies && post.replies.length > 0 ? (
                        <div className="space-y-3"> {/* Slightly more space between replies */}
                            {/* Render top-level replies using ReplyItem component */}
                            {post.replies.map((reply) => (
                                <ReplyItem
                                    key={reply._id}
                                    reply={reply}
                                    postId={post._id} 
                                    onReplySubmit={replyTo} // Pass the main reply handler
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    depth={0} // Initial depth for top-level replies
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic py-2">No offers of help yet. Be the first to respond!</p>
                    )}

                    {/* Input for new top-level reply to the post */}
                    <div className="flex flex-col gap-3 mt-6"> {/* Changed to flex-col for better vertical alignment on small screens */}
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400"
                            placeholder="Offer your help or ask for more details..."
                            value={replyText[post._id] || ""} // Use post._id as key for top-level reply
                            onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    replyTo(post._id, e.target.value); // Pass postId for top-level reply
                                    e.preventDefault();
                                }
                            }}
                        />
                        <button
                            onClick={() => replyTo(post._id, replyText[post._id])} // Pass postId for top-level reply
                            className="self-end bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md"
                        >
                            Reply to Post
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* ToastContainer is handled globally by App.js - it should NOT be here */}

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-10 space-x-4">
                <button
                    onClick={() => setViewMyPosts(true)}
                    className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out shadow-lg ${
                        viewMyPosts ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    My Help Requests
                </button>
                <button
                    onClick={() => setViewMyPosts(false)}
                    className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out shadow-lg ${
                        !viewMyPosts ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Community Backlog Help
                </button>
            </div>

            {/* Conditional Rendering for Create Post Section */}
            {viewMyPosts && (
                <form onSubmit={createPost} className="bg-white p-8 rounded-lg shadow-xl mb-10 border border-gray-200 md:max-w-3xl lg:max-w-4xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Ask for Help</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="post-title" className="sr-only">Title</label>
                            <input
                                id="post-title"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                                placeholder="Briefly describe the backlog task or help you need..."
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="post-description" className="sr-only">Description</label>
                            <textarea
                                id="post-description"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out min-h-[120px] placeholder-gray-400"
                                placeholder="Provide details: What's the issue? What have you tried? What kind of help are you looking for?"
                                value={newPost.description}
                                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-lg"
                        >
                            Post My Request
                        </button>
                    </div>
                </form>
            )}

            {/* Posts Display Section - Rendered based on toggle state */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {viewMyPosts ? "My Submitted Requests" : "Community Help Requests"}
            </h3>
            {/* NEW LAYOUT: Single column, centered, with max width */}
            <div className="grid grid-cols-1 gap-8 md:max-w-3xl lg:max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="col-span-1 text-center py-8"> {/* Adjusted col-span to 1 */}
                        <p className="text-gray-600 italic">Loading requests...</p>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mt-4"></div>
                    </div>
                ) : viewMyPosts ? (
                    myPosts.length === 0 ? (
                        <p className="col-span-1 text-center text-gray-600 italic py-8"> {/* Adjusted col-span to 1 */}
                            You haven't posted any help requests yet. Use the form above to share your backlog challenges!
                        </p>
                    ) : (
                        myPosts.map((post) => renderPostCard(post, true))
                    )
                ) : (
                    allPosts.length === 0 ? (
                        <p className="col-span-1 text-center text-gray-600 italic py-8"> {/* Adjusted col-span to 1 */}
                            No community help requests have been posted yet. Be the first to ask for or offer help!
                        </p>
                    ) : (
                        allPosts.map((post) => renderPostCard(post))
                    )
                )}
            </div>
        </div>
    );
};

export default Backlog;

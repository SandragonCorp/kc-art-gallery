"use client"

import { createComment, deletePost, toggleLike } from '@/actions/post.action'
import { SignInButton, useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarImage } from './ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { DeleteAlertDialog } from './DeleteAlertDialog'
import { Button } from './ui/button'
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon, XIcon } from 'lucide-react'
import { Textarea } from './ui/textarea'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';

function PostCard({ post, dbUserId }) {
  const { user } = useUser()
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId))
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes)
  const [showComments, setShowComments] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLike = async () => {
    if (isLiking) return
    try {
      setIsLiking(true)
      setHasLiked(!hasLiked)
      setOptimisticLikes(hasLiked ? optimisticLikes - 1 : optimisticLikes + 1)
      await toggleLike(post.id)
    } catch (error) {
      setOptimisticLikes(post._count.likes)
      setHasLiked(post.likes.some(like => like.userId === dbUserId))
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment || isCommenting) return
    try {
      setIsCommenting(true)
      const result = await createComment(post.id, newComment)
      if (result?.success) {
        toast.success("Comment posted successfully")
        setNewComment("")
      }
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false)
    }
  }

  const handleDeletePost = async () => {
    if (isDeleting) return
    try {
      setIsDeleting(true)
      const result = await deletePost(post.id)
      if (result?.success) toast.success("Post deleted successfully")
      else throw new Error(result.error)
    } catch (error) {
      console.error("Failed to delete post:", error)
      toast.error("Failed to delete post")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  </div>
                </div>
                {dbUserId === post.author.id && (
                  <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />
                )}
              </div>
              <div className='flex flex-col items-center justify-center'>
                {post.title ? (
                  <p className="mt-2 text-sm text-foreground break-words text-center">{post.title}</p>
                ) : (
                  <p className="mt-2 text-sm text-foreground break-words italic text-center">No Title</p>
                )}
              </div>
              <div className='flex flex-col items-center justify-center'>
                {post.title ? (
                  <p className="mt-2 text-sm text-foreground break-words text-center">{post.content}</p>
                ) : (
                  <p className="mt-2 text-sm text-foreground break-words italic text-center">No Description</p>
                )}
              </div>
            </div>
          </div>

          {/* POST IMAGE */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover cursor-pointer" onClick={() => setIsModalOpen(true)} />
            </div>
          )}

          {/* IMAGE VIEWER MODAL */}
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="relative max-w-3xl w-full p-4">
                <button
                  className="absolute top-0 right-0 p1 bg-red-500 rounded-full shadow-ssm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <XIcon className="h-4 w-4 text-white" />
                </button>
                <Zoom>
                <img
                  src={post.image}
                  alt="Expanded Post Content"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                />
                </Zoom>
              </div>
            </div>
          )}

          {/* LIKE & COMMENT BUTTONS */}
          <div className="flex items-center justify-between pt-2 space-x-4">
            <div>
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground gap-2 ${hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                    }`}
                  onClick={handleLike}
                >
                  {hasLiked ? (
                    <HeartIcon className="size-5 fill-current" />
                  ) : (
                    <HeartIcon className="size-5" />
                  )}
                  <span>{optimisticLikes}</span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                    <HeartIcon className="size-5" />
                    <span>{optimisticLikes}</span>
                  </Button>
                </SignInButton>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-2 hover:text-blue-500"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircleIcon
                  className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}
                />
                <span>{post.comments.length}</span>
              </Button>
            </div>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>

          {/* COMMENTS SECTION */}
          {showComments && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-4">
                {/* DISPLAY COMMENTS */}
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {user ? (
                <div className="flex space-x-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        className="flex items-center gap-2"
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? (
                          "Posting..."
                        ) : (
                          <>
                            <SendIcon className="size-4" />
                            Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="gap-2">
                      <LogInIcon className="size-4" />
                      Sign in to comment
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard
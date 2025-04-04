"use client"

import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ImageIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { Button } from './ui/button';
import { createPost } from '@/actions/post.action';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

function CreatePost() {
  const { user } = useUser()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if(!imageUrl) return

    setIsPosting(true);
    try {
      const result = await createPost(title, content, imageUrl);
      if(result.success) {
        // reset the form
        setTitle("")
        setContent("")
        setImageUrl("")
        setShowImageUpload(false)

        toast.success("Post created successfully");
      }
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Textarea
              placeholder="What is the Title?"
              className="min-h-[50px] resize-none focus-visible:ring-0 p-0 text-base border-hidden"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPosting}
            />
          </div>
          <div className="flex space-x-4">
            <Textarea
              placeholder="Description?"
              className="min-h-[50px] resize-none focus-visible:ring-0 p-0 text-base border-hidden"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>
          
          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if(!url) setShowImageUpload(false)
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={!imageUrl || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost
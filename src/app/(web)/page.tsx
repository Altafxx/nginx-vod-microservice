import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchVideos } from "../action/video";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Video, Folder } from "@prisma/client";
import { Upload, PlayCircle, Clock, FolderIcon, Loader2 } from "lucide-react";

export const revalidate = 300;
export default async function Home() {
  const videos = await fetchVideos();

  return (
    <main className="flex flex-col min-h-screen py-24 space-y-16">
      <div className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <h1 className="relative text-5xl font-bold inline-flex items-center justify-center gap-3">
          {/* <span className="absolute -left-4 w-2 h-2 bg-primary rounded-full translate-y-[2px]" /> */}
          AevumFlow
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A modern video hosting platform built with Next.js and NGINX. Upload, stream, and share your videos with ease.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/upload" className="flex items-center gap-2">
              <Upload size={20} />
              Upload Video
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#explore">
              Explore Videos
            </Link>
          </Button>
        </div>
      </div>

      <div id="explore" className="max-w-7xl w-full py-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos && videos.map((video: Video & { folder: Folder | null }) => (
          <Link href={`/${video?.id}`} key={video?.id} className="group">
            <Card className="h-full overflow-hidden border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader className="relative p-0">
                <div className="overflow-hidden aspect-video relative">
                  <Image
                    src={video.thumbnail ? `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}` + video.thumbnail + ".webp" : "/thumbnail.webp"}
                    alt={video?.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  {/* Add status indicators */}
                  {video.isProcessing && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground rounded-full px-3 py-1 text-xs">
                      <Loader2 size={12} className="animate-spin" />
                      Processing
                    </div>
                  )}
                  {!video.isProcessing && video.isReady && (
                    <div className="absolute right-2 top-2 bg-green-500/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      Ready
                    </div>
                  )}
                  {video?.folder?.name && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground rounded-full px-3 py-1 text-xs">
                      <FolderIcon size={12} />
                      {video?.folder?.name}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="line-clamp-1 text-lg">{video?.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{video?.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {new Date(video?.createdAt).toLocaleString()}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {videos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 border-2 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No videos found</p>
            <p className="text-muted-foreground">Be the first to upload a video!</p>
          </div>
        )}
      </div>
    </main>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchVideos } from "../action/video";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Video, Folder } from "@prisma/client";
// import { checkThumbnail } from "../action/thumbnail";

export default async function Home() {
  const videos = await fetchVideos();

  return (
    <main className="flex flex-col min-h-screen place-items-center py-24 space-y-4">
      <div className="font-bold text-2xl">Just Some Random Video Engine</div>
      <Button asChild>
        <Link href="/upload">
          Upload Video
        </Link>
      </Button>
      <div className="max-w-5xl w-full max-xl:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          videos && videos.map((video: Video & { folder: Folder | null }) => (
            <Link href={`/${video?.id}`} key={video?.id}>
              <Card key={video?.id} className="h-full">
                <CardHeader className="relative">
                  <div className="overflow-clip rounded-md">
                    <Image
                      src={video.thumbnail ? "http://minio:9000" + video.thumbnail + ".webp" : "/thumbnail.webp"}
                      alt={video?.title}
                      width={640}
                      height={360}
                    />
                  </div>
                  {
                    video?.folder?.name && (
                      <div className="flex absolute right-2 top-2 bg-primary text-secondary rounded-md px-4 py-2">{video?.folder?.name}</div>
                    )
                  }
                </CardHeader>
                <CardContent>
                  <CardTitle>{video?.title}</CardTitle>
                  <CardDescription className="">{video?.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-gray-500">
                    {new Date(video?.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        }
        {
          videos.length === 0 && (
            <div className="text-center col-span-3 text-gray-500">
              No videos found
            </div>
          )
        }
      </div>
    </main>
  );
}

import { Link } from "react-router-dom"

interface BlogCardProps {
    authorName: string,
    title: string,
    content: string,
    publishDate: string,
    id: string
}

function BlogCard({ authorName, title, content, publishDate, id }: BlogCardProps) {
    return (
        <Link to={`/blog/${id}`}>
            <div className="border-b border-slate-200 pb-4 w-screen cursor-pointer flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Avatar name={authorName} />
                    <p className="font-semibold text-slate-600">{authorName}</p>
                    <p className="font-thin text-slate-500 text-sm">
                        {publishDate}
                    </p>
                </div>
                <h1 className="text-2xl font-bold">
                    {title}
                </h1>
                <p className="text-base font-thin">
                    {content.slice(0, 100) + "..."}
                </p>
                <p className="text-slate-500 text-sm font-semibold">
                    {`${Math.ceil(content?.length / 100)} minute(s) read`}
                </p>
            </div>
        </Link>
    )
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
    return (
        <div className={`flex items-center justify-center bg-gray-400 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
            <span className={`${size === "small" ? "text-sm" : "text-base"} font-semibold text-slate-700 `}>
                {name[0]}
            </span>
        </div>
    )
}
export default BlogCard



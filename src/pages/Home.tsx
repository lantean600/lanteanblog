import { PageMeta } from "@/components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta title="Home" description="Home" keywords={["Home"]} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <img
            src="https://img.alicdn.com/imgextra/i3/O1CN01Lyrxuu1IuWXYYokX3_!!6000000000953-1-tps-381-336.gif"
            alt="Loading"
            className="w-48 h-auto"
          />
          <p className="text-lg font-medium text-gray-700">应用构建中</p>
        </div>
      </div>
    </>
  );
}

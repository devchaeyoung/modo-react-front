export default function Home() {
  return (
    // This is the template home page, please edit from this page
    <div className="relative flex h-screen flex-col items-center justify-center px-4 text-center">
      <p className="absolute top-4 text-lg text-gray-500">
        You can switch pages using this dropdown menu ⬆️
      </p>
      <div className="relative z-10">
        <h1 className="mt-6 text-xl font-semibold md:text-2xl">
          This is homepage, but there is no content yet
        </h1>
        <p className="mt-4 text-lg text-gray-500 md:text-xl">
          Tell me more about homepage, so I can generate it
        </p>
      </div>
    </div>
  )
}

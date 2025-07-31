import Link from "next/link"

export function Breadcrumb() {
  return (
    <div className="mb-4 text-sm">
      <Link href="#" className="text-blue-600 hover:underline">
        HSBC
      </Link>
      <span className="mx-1 text-gray-500">/</span>
      <span className="text-gray-500">Vendors</span>
    </div>
  )
}

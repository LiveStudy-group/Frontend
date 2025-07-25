import { FiMessageSquare } from "react-icons/fi";

export default function MessageButton({ onClick }: { onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 sm:bottom-28 bg-primary-500 p-6 rounded-full border border-gray-300 shadow-lg text-white hover:bg-primary-600">
      <FiMessageSquare className="w-6 h-6" />
    </button>
  )
}
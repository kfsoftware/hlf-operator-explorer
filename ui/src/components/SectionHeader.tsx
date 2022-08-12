/* This example requires Tailwind CSS v2.0+ */
export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pb-5 border-b border-gray-200">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
  );
}

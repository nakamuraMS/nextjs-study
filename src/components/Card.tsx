type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
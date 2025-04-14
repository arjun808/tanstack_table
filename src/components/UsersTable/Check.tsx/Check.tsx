interface CheckProps {
  isActive: boolean;
}
const Check = ({ isActive }: CheckProps) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default Check;

export const SimpleDoughnut = ({ data, options }: any) => {
  const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.datasets[0].data.map((value: number, index: number) => {
          const percentage = value / total;
          const circumference = 2 * Math.PI * 30;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const rotation = data.datasets[0].data.slice(0, index).reduce((acc: number, val: number) => 
            acc + (val / total) * 360, 0
          );
          
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke={data.datasets[0].backgroundColor[index]}
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset="0"
              style={{
                transformOrigin: '50% 50%',
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};
import { Dispatch, SetStateAction, useState } from "react";
import { Range, getTrackBackground } from "react-range";

type PriceRange = {
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
  MIN?: number;
  MAX?: number;
};

export default function PriceRange({
  values,
  setValues,
  MIN = 0,
  MAX,
}: PriceRange) {
  const [isDragging, setIsDragging] = useState(false);
  if (!MAX) return;
  return (
    <div className="w-full max-w-60 p-6 rounded-2xl gap-3 shadow bg-white ">
      <Range
        values={values}
        step={1}
        min={MIN}
        max={MAX}
        onChange={(values) => {
          setIsDragging(true);
          setValues(values);
        }}
        onFinalChange={() => {
          setIsDragging(false);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 w-full rounded-full transition-all duration-300"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#E5E7EB", "#FFA500", "#E5E7EB"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="relative flex items-center justify-center h-6 w-6 rounded-full bg-white border-2 border-violet-400 shadow-md focus:outline-none"
            >
              {/* Value */}
              <span
                className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-violet-600 px-2 py-1 text-xs font-semibold text-white transition-all duration-1000 ease-out ${
                  isDragging
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {values[index]}
              </span>
            </div>
          );
        }}
      />

      <div className="flex mt-5 w-[115%] justify-between -translate-x-3">
        <div className="flex flex-col">
          <input
            id="minRange"
            type="text"
            value={values[0]}
            style={{ width: `${Math.max(String(values[0]).length + 2, 5)}ch` }}
            className="px-2 py-1 text-center border border-gray-300 rounded-2xl"
            onChange={(e) =>
              setValues((prev) => {
                const next = [...prev];
                next[0] = Number(e.target.value);
                return next;
              })
            }
          />
          <label
            htmlFor="minRange"
            className="hidden text-xs text-gray-400 text-center font-bold"
          >
            min
          </label>
        </div>
        <div className="flex flex-col">
          <input
            id="maxRange"
            type="text"
            value={values[1]}
            style={{ width: `${Math.max(String(values[1]).length + 2, 5)}ch` }}
            className="px-2 py-1 text-center border border-gray-300 rounded-2xl"
            onChange={(e) =>
              setValues((prev) => {
                const next = [...prev];
                next[1] = Number(e.target.value);
                return next;
              })
            }
          />
          <label
            htmlFor="maxRange"
            className="hidden text-xs text-gray-400 text-center font-bold"
          >
            max
          </label>
        </div>
      </div>
    </div>
  );
}

import { ClimbingBoxLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/helpers/props";

export const LoadingScreen = ({
  loading,
  color,
  speedMultiplier,
  cssOverride,
  size,
}: LoaderSizeProps): React.JSX.Element | null => {
  return (
    <>
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-100 ">
          <ClimbingBoxLoader
            loading={true}
            color={color}
            speedMultiplier={speedMultiplier}
            cssOverride={cssOverride}
            size={size}
          />
          <span className="text-white mt-2 text-2xl">Now Loading…</span>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LoadingScreen;

import AppColors from "../../../utils/appColors";
import AppIcons from "../../../utils/appIcons";

const VideoScreen = ({
  micStaus = true,
  displayName,
  videoRef,
  isHost,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#000] w-[420px] h-[250px] rounded-xl">
      <video
        ref={videoRef}
        autoPlay
        muted={isHost}
        playsInline
        className="w-full h-full object-cover"
      />
      <div className={`absolute bottom-2 left-2 ${AppColors.buttonColor} px-2 py-1 rounded-md text-sm flex items-center gap-2 text-white`}>
        <img
          src={micStaus ? AppIcons.enabledAudio : AppIcons.muteMic}
          className="w-4 h-4"
        />
        <span>{displayName || "Host"}</span>
      </div>
    </div>
  );
};

export default VideoScreen;

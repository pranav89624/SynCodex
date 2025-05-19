import AppColors from "../../../utils/appColors";
import AppIcons from "../../../utils/appIcons";

const VideoScreen = ({
  isInterviewMode,
  localVideoRef,
  remoteVideoRef,
  localMicStatus,
  remoteMicStatus,
  hostDisplayName,
  guestDisplayName,
}) => {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
      {/* REMOTE/ GUEST VIDEO */}
      <div
        className={`relative overflow-hidden rounded-xl bg-[#000] ${
          isInterviewMode ? "w-[420px] h-[250px]" : "w-full"
        }`}
        style={{
          aspectRatio: isInterviewMode ? "auto" : "16 / 9",
          height: isInterviewMode ? "250px" : "auto",
        }}
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute bottom-1.5 left-1.5 sm:bottom-1.5 sm:left-1.5 md:bottom-2 md:left-2 ${AppColors.buttonColor} px-1 py-0.5 sm:px-1 md:px-2 md:py-1 rounded-md text-xs sm:text-xs md:text-xs lg:text-sm flex items-center gap-0.5 sm:gap-1 md:gap-2 text-white`}
        >
          <img
            src={!remoteMicStatus ? AppIcons.enabledAudio : AppIcons.muteMic}
            className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"
          />
          <span>{guestDisplayName || "Guest"}</span>
        </div>
      </div>

      {/* LOCAL/ HOST VIDEO */}
      <div
        className={`relative overflow-hidden rounded-xl bg-[#000] ${
          isInterviewMode ? "w-[420px] h-[250px]" : "w-full"
        }`}
        style={{
          aspectRatio: isInterviewMode ? "auto" : "16 / 9",
          height: isInterviewMode ? "250px" : "auto",
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute bottom-1.5 left-1.5 sm:bottom-1.5 sm:left-1.5 md:bottom-2 md:left-2 ${AppColors.buttonColor} px-1 py-0.5 sm:px-1 md:px-2 md:py-1 rounded-md text-xs sm:text-xs md:text-xs lg:text-sm flex items-center gap-0.5 sm:gap-1 md:gap-2 text-white`}
        >
          <img
            src={localMicStatus ? AppIcons.enabledAudio : AppIcons.muteMic}
            className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"
          />
          <span>{hostDisplayName || "Host"}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoScreen;

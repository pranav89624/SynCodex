import VideoCallToolbar from "./subComponent/VideoCallToolbar";
import VideoScreen from "./subComponent/VideoScreen";

const VideoCallSection = ({ isInterviewMode }) => {
  return (
    <div className={`flex flex-col py-3 px-3 h-full `}>
      {/* Video Screen's */}
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
        <VideoScreen
          isInterviewMode={isInterviewMode}
          micStaus={true}
          displayName={"Pranav"}
        />
        <VideoScreen
          isInterviewMode={isInterviewMode}
          micStaus={false}
          displayName={"Harsh (You)"}
        />
      </div>

      {/* Video Call Toolbar */}
      <VideoCallToolbar isInterviewMode={isInterviewMode} />
    </div>
  );
};

export default VideoCallSection;

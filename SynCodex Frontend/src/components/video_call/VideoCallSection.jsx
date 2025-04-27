import VideoCallToolbar from "./subComponent/VideoCallToolbar";
import VideoScreen from "./subComponent/VideoScreen";

const VideoCallSection = () => {
  

  return (
    <div className="flex flex-col py-3 px-3 h-full">
    {/* Video Screen's */}
      <div className="flex flex-col gap-3">
        <VideoScreen micStaus={true} displayName={"Pranav"}/>
        <VideoScreen micStaus={false} displayName={"Harsh (You)"}/>
      </div>

      {/* Video Call Toolbar */}
      <VideoCallToolbar/>
    </div>
  );
};

export default VideoCallSection;

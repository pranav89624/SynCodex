import { useState } from "react";
import IconButton from "../../IconButton";
import AppColors from "../../../utils/appColors";
import AppIcons from "../../../utils/appIcons";

const VideoCallToolbar = () => {
  const [micDisable, setMicDisable] = useState(true);
  const [camDisable, setCamDisable] = useState(true);
  const [speakerOff, setSpeakerOff] = useState(false);
  // const [remoteMicOff, setRemoteMicOff] = useState(false);

  const toggleMic = () => {
    const enabled = !micDisable;
    // localStream.current.getAudioTracks()[0].enabled = enabled;
    setMicDisable(enabled);
    // socket.emit("media-toggled", {
    //   room: roomId,
    //   mic: enabled,
    //   cam: camDisable,
    // });
  };

  const toggleCam = () => {
    const enabled = !camDisable;
    // localStream.current.getVideoTracks()[0].enabled = enabled;
    setCamDisable(enabled);
    // socket.emit("media-toggled", {
    //   room: roomId,
    //   mic: micDisable,
    //   cam: enabled,
    // });
  };

  const toggleSpeaker = () => {
    // if (remoteVideoRef.current) {
    //   const newMuted = !remoteVideoRef.current.muted;
    //   remoteVideoRef.current.muted = newMuted;
    setSpeakerOff(!speakerOff);
    // }
  };

  const toggleEndCall = () => {
    // peerConnection.current?.close();
    // if (localVideoRef.current) localVideoRef.current.srcObject = null;
    // if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col justify-end items-center pt-3 h-full">
      <div className={`flex gap-3 p-3 rounded-xl border-1 border-[#E4E6F3]`}>
        <IconButton
          icon={AppIcons.micOff}
          buttonColor={micDisable ? AppColors.buttonColor : AppColors.container}
          onClick={toggleMic}
          label={micDisable ? "Mic OFF" : "Mic ON"}
        />
        <IconButton
          icon={AppIcons.speakerOff}
          buttonColor={speakerOff ? AppColors.container : AppColors.buttonColor}
          onClick={toggleSpeaker}
          label={speakerOff ? "Speaker ON" : "Speaker OFF"}
        />
        <IconButton
          icon={AppIcons.videoOff}
          buttonColor={camDisable ? AppColors.buttonColor : AppColors.container}
          onClick={toggleCam}
          label={camDisable ? "Camera OFF" : "Camera ON"}
        />
        <IconButton
          icon={AppIcons.moreHorizontal}
          buttonColor={AppColors.buttonColor}
          onClick={toggleCam}
          label="More"
        />
        <IconButton
          icon={AppIcons.callEnd}
          buttonColor={AppColors.redColor}
          onClick={toggleEndCall}
          label="End Call"
        />
      </div>
    </div>
  );
};

export default VideoCallToolbar;

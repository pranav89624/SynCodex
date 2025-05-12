import VideoCallToolbar from "./subComponent/VideoCallToolbar";
import VideoScreen from "./subComponent/VideoScreen";
import { useSocket } from "../../context/SocketProvider";
import React, { useEffect, useRef, useState } from "react";

const VideoCallSection = ({ roomIdVCS, isInterviewMode }) => {
  const socket = useSocket();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const [micDisable, setMicDisable] = useState(true);
  const [camDisable, setCamDisable] = useState(true);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [remoteMicOff, setRemoteMicOff] = useState(true);
  const [remoteCamOn, setRemoteCamOn] = useState(true);

  const [isRemoteConnected, setIsRemoteConnected] = useState(false);


  useEffect(() => {
    if (!socket) return;

    const start = async () => {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      socket.emit("join-room", roomIdVCS);

      socket.on("all-users", async (users) => {
        users.forEach((userId) => {
          createPeer(userId, true);  // true => I am the caller
        });
        // if (users.length > 0) {
        //   createPeer(users[0], true);
        // }
      });

      socket.on("user-joined", (userId) => {
        console.log("New user joined:", userId);
        //
        createPeer(userId,true); // true => isCaller
        setIsRemoteConnected(true);
        //
      });

      socket.on("offer", async ({ sdp, caller }) => {
        await createPeer(caller, false, sdp);
      });

      socket.on("answer", async ({ sdp }) => {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Error adding received ice candidate", err);
        }
      });

      socket.on("media-toggled", (data) => {
        console.log("Remote media toggled received", data);
        setRemoteMicOff(data.mic); // mic === true means it's ON
        setRemoteCamOn(data.cam); // data.cam === true means camera is on
      });

      //
      socket.on("user-left", () => {
        console.log("User disconnected");
        setIsRemoteConnected(false);
      });
      //
    };

    start();

    return () => {
      socket.off("user-joined");
      peerConnection.current?.close();
    };
  }, [roomIdVCS, socket]);

  const createPeer = async (targetId, isCaller, remoteSdp = null) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          target: targetId,
          candidate: e.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    if (isCaller) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { target: targetId, sdp: offer });
    } else if (remoteSdp) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteSdp)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { target: targetId, sdp: answer });
    }
  };

  const toggleMic = () => {
    const enabled = !micDisable;
    localStream.current.getAudioTracks()[0].enabled = enabled;
    setMicDisable(enabled);
    socket.emit("media-toggled", {
      room: roomIdVCS,
      mic: enabled,
      cam: camDisable,
    });
  };

  const toggleCam = () => {
    const enabled = !camDisable;
    localStream.current.getVideoTracks()[0].enabled = enabled;
    setCamDisable(enabled);
    socket.emit("media-toggled", {
      room: roomIdVCS,
      mic: micDisable,
      cam: enabled,
    });
  };

  // const toggleCam = async () => {
  //   const enable = !camDisable;
  //   setCamDisable(enable);
  //   if (enable) {
  //     try {
  //       const newStream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //         audio: micDisable, // keep audio state as is
  //       });
  //       const newVideoTrack = newStream.getVideoTracks()[0];
  //       const oldTrack = localStream.current.getVideoTracks()[0];
  //       if (oldTrack) localStream.current.removeTrack(oldTrack);
  //       localStream.current.addTrack(newVideoTrack);
  //       if (localVideoRef.current) {
  //         localVideoRef.current.srcObject = localStream.current;
  //       }
  //       const sender = peerConnection.current?.getSenders().find(
  //         (s) => s.track.kind === "video"
  //       );
  //       if (sender) sender.replaceTrack(newVideoTrack);
  
  //     } catch (err) {
  //       console.error("Camera access failed:", err);
  //       return;
  //     }
  //   } else {
  //     const videoTrack = localStream.current?.getVideoTracks()[0];
  //     if (videoTrack) {
  //       videoTrack.enabled = false;
  //     }
  //   }
  //   socket.emit("media-toggled", {
  //     room: roomIdVCS,
  //     mic: micDisable,
  //     cam: enable,
  //   });
  // };
  

  // const toggleCam = async () => {
  //   const enabled = !camDisable;
  //   console.log("Local viedo ref 1 :: ",localVideoRef.current);
  //       const videoTrack = localStream.current.getVideoTracks()[0];
  //       if (enabled && localVideoRef.current == null) {
  //         console.log("IFFF Called ::");
  //         localVideoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
  //           video: true,
  //           audio: micDisable,
  //         });
  //         console.log("Local viedo ref 2 :: ",localVideoRef.current);
  //       }else{
  //         console.log("ELSE Called ::");
  //     videoTrack.enabled = enabled;
  //     console.log("Vidoe track.enabled :: ",videoTrack.enabled);

  //   }
  //   setCamDisable(enabled);
  //   socket.emit("media-toggled", {
  //     room: roomIdVCS,
  //     mic: micDisable,
  //     cam: enabled,
  //   });
  // };

  // const toggleCam = () => {
  //   const newCamStatus = !camDisable;
  
    // const videoTrack = localStream.current.getVideoTracks()[0];
    // if (videoTrack) {
    //   videoTrack.enabled = newCamStatus;
    // }
  
    // // Force reassigning video stream to fix black screen
    // if (newCamStatus && localVideoRef.current) {
    //   localVideoRef.current.srcObject = localStream.current;
    // }
  
  //   setCamDisable(!newCamStatus);
  
  //   socket.emit("media-toggled", {
  //     room: roomIdVCS,
  //     mic: micDisable,
  //     cam: newCamStatus,
  //   });
  // };

  // const toggleCam = async () => {
  //   const enable = !camDisable;
  
  //   if (enable) {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       const videoTrack = stream.getVideoTracks()[0];
  
  //       // Replace the existing track with new one
  //       const sender = peerConnection.current
  //         ?.getSenders()
  //         .find((s) => s.track.kind === "video");
  
  //       if (sender) {
  //         sender.replaceTrack(videoTrack);
  //       }
  
  //       localStream.current.removeTrack(localStream.current.getVideoTracks()[0]);
  //       localStream.current.addTrack(videoTrack);
  
  //       if (localVideoRef.current) {
  //         localVideoRef.current.srcObject = localStream.current;
  //       }
  
  //     } catch (err) {
  //       console.error("Error re-accessing camera", err);
  //       return;
  //     }
  //   } else {
  //     // Just disable the track
  //     const videoTrack = localStream.current.getVideoTracks()[0];
  //     if (videoTrack) videoTrack.enabled = false;
  //   }
  
  //   setCamDisable(!enable);
  
  //   socket.emit("media-toggled", {
  //     room: roomIdVCS,
  //     mic: micDisable,
  //     cam: enable,
  //   });
  // };
  
  

  const toggleSpeaker = () => {
    if (remoteVideoRef.current) {
      const newMuted = !remoteVideoRef.current.muted;
      remoteVideoRef.current.muted = newMuted;
      setSpeakerOff(newMuted);
    }
  };

  const toggleEndCall = () => {
    peerConnection.current?.close();
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    window.location.href = "/dashboard";
  };

  return (
    <div className={`flex flex-col py-3 px-3 h-full `}>
      {/* Video Screen's */}
      <VideoScreen
        isInterviewMode={isInterviewMode}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        localMicStatus={micDisable}
        remoteMicStatus={remoteMicOff}
        localCamDisable={camDisable}
        remoteCamDisable={remoteCamOn}
        isRemoteConnected={isRemoteConnected}
      />

      {/* Video Call Toolbar */}
      <VideoCallToolbar
        micDisable={micDisable}
        camDisable={camDisable}
        speakerOff={speakerOff}
        toggleMic={toggleMic}
        toggleCam={toggleCam}
        toggleSpeaker={toggleSpeaker}
        toggleEndCall={toggleEndCall}
      />
    </div>
  );
};

export default VideoCallSection;

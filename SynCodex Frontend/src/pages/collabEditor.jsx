import { useParams } from "react-router-dom";
import CollabEditorLayout from "../components/editor/CollabEditorLayout";

export default function CollabEditorPage() {
    const { roomId } = useParams();
    return (
        <CollabEditorLayout roomId={roomId} isInterviewMode={false}/>
    )
}
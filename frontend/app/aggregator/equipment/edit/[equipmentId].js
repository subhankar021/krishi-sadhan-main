import { useGlobalSearchParams } from "expo-router";
import CreateEquipment from "../../../../components/aggregator/CreateEquipment";

export default function App() {
    const { equipmentId } = useGlobalSearchParams();
    return (
        <>
            <CreateEquipment equipmentId={equipmentId} />
        </>
    )
}
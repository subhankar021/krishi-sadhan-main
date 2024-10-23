import { useGlobalSearchParams } from "expo-router";
import EquipmentScheduler from "../../../../components/aggregator/Scheduler";

export default function App() {
    const { equipmentId } = useGlobalSearchParams();
    return (
        <>
            <EquipmentScheduler equipmentId={equipmentId} />
        </>
    )
}
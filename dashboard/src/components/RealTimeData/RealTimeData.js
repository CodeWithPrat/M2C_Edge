import { Routes, Route, Navigate } from 'react-router-dom';
import Tab from "../RealTimeData/OPCUA/Tab"
import RS232Monitor from './RS232/RS232Monitor';
import Modbus from './MODBUS/Modbus';
import RS485Monitor from './RS485/RS485';
import OPCUA from './OPCUA/OPCUA';
import MmTab from './OPCUA/MillingMachine/MM_Tab'
import LmTab from './OPCUA/LatheMachine/LM_Tab'
// import LatheMachine from '../RealTimeData/OPCUA/LatheMachine';
// import MillingMachine from '../RealTimeData/OPCUA/MillingMachine';

const RealTimeData = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="opcua" replace />} />

        {/* Parent OPCUA route */}
        <Route path="opcua" element={<OPCUA />}>
          {/* Default sub-route -> Ideal Digital Twin */}
          <Route index element={<Tab />} />

          {/* Nested Routes */}
          <Route path="ideal-digital-twin" element={<Tab />} />
          <Route path="lathe-machine" element={<LmTab />} />
          <Route path="milling-machine" element={<MmTab/>} />
        </Route>

        <Route path="rs232" element={<RS232Monitor />} />
        <Route path="modbus" element={<Modbus />} />
        <Route path="rs485" element={<RS485Monitor />} />
      </Routes>
    </div>
  );
};

export default RealTimeData;

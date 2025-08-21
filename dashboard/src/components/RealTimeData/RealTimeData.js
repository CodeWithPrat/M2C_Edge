// components/RealTimeData/RealTimeData.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import OPCUA from '../RealTimeData/OPCUA/Tab';
import RS232Monitor from './RS232/RS232Monitor';
import Modbus from './MODBUS/Modbus';


const RealTimeData = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="opcua" replace />} />
        <Route path="opcua" element={<OPCUA />} />
        <Route path="rs232" element={<RS232Monitor />} />
        <Route path="modbus" element={<Modbus />} />
        {/* <Route path="rs232" element={<RS232 />} />
        <Route path="modbus" element={<Modbus />} />
        <Route path="rs485" element={<RS485 />} /> */}
      </Routes>
    </div>
  );
};

export default RealTimeData;
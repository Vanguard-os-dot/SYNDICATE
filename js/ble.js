// Web Bluetooth integration for receiving payments from ESP32
async function connectAndReceiveBLE() {
  const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
  const CHARACTERISTIC_UUID = "87654321-4321-6789-4321-0fedcba98765";

  if (!navigator.bluetooth) {
    showToast('Web Bluetooth not supported on this browser');
    return;
  }

  const userInput = prompt("Enter payment amount to request from ESP32 (R):", "500.00");
  if (userInput === null) return;

  const receiveAmount = parseFloat(userInput);
  if (isNaN(receiveAmount) || receiveAmount <= 0) {
    showToast('Invalid claim amount entered');
    return;
  }

  try {
    showToast('Scanning for ESP32 Terminal...');
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }]
    });

    showToast('Connecting to terminal...');
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    const payload = `RECEIVE_CLAIM:${receiveAmount.toFixed(2)}`;
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(payload));

    try {
      const responseBuffer = await characteristic.readValue();
      const decoder = new TextDecoder('utf-8');
      const responseText = decoder.decode(responseBuffer);
      console.log('ESP32 Terminal Response:', responseText);
    } catch (readError) {
      console.warn('No response payload returned from ESP32 characteristic, proceeding with local credit.');
    }

    state.checking += receiveAmount;
    state.transactions.unshift({
      id: Date.now(),
      desc: "BLE Terminal Inbound Wire",
      meta: `Hardware POS Receive • ${state.user.name} ${state.user.id}`,
      amount: receiveAmount,
      type: "credit",
      status: "Settled"
    });
    
    updateUI();
    showToast(`Received ${formatCurrency(receiveAmount)} via BLE!`);

    if (device.gatt.connected) {
      device.gatt.disconnect();
    }
  } catch(error) {
    console.error('BLE Error:', error);
    showToast('Connection failed or canceled');
  }
}
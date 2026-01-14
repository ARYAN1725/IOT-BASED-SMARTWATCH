import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import template from './reportTemplate.html';

export async function generateHealthReport(data) {
  let html = template
    .replace('{{username}}', data.username)
    .replace('{{date}}', new Date().toDateString())
    .replace('{{bmi}}', data.bmi)
    .replace('{{heartRate}}', data.heartRate)
    .replace('{{heartRateStatus}}', data.heartRateStatus)
    .replace('{{spo2}}', data.spo2)
    .replace('{{spo2Status}}', data.spo2Status);

  const file = await Print.printToFileAsync({
    html,
    base64: false
  });

  await Sharing.shareAsync(file.uri);
}

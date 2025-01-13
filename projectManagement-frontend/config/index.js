import { Platform } from 'react-native';

// プラットフォームごとに設定ファイルをインポート
const getConfig = () => {
  switch (Platform.OS) {
    case 'ios':
      return require('./config.ios').default;
    case 'android':
      return require('./config.android').default;
    default:
      throw new Error('Unsupported platform');
  }
};

const config = getConfig();
export default config;
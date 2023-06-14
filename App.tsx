/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import CodePush from "react-native-code-push";
import ProgressBarModal from './src/component/ProgressBarModal';

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };
  
//   useEffect(()=>{
//     console.log('123456789')

//   },[])

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <Text>12345678</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

type Props = {
  
};
type State = {
  progressModalVisible: any,
  syncMessage: string,
  progress: boolean,
  progressValue: any
};


class App extends Component<Props, State, {}>{
  constructor(props: any){
    super(props);
    this.state={
        progressModalVisible:false,
        syncMessage: '---',
        progress:false,

        progressValue: null
    }
  }
  async checkUpdate(){
    // const checkForUpdate = await CodePush.getUpdateMetadata()
    // if (!checkForUpdate) {
    //     console.log("The app is up to date!");
    // } else {
    //     console.log("An update is available! Should we download it?");
    // };
    // console.log('-------->>>checkForUpdate',checkForUpdate);
    

    const update = await CodePush.getCurrentPackage();
    console.log('-------->>>getCurrentPackage',update);

    // return;

    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
            appendReleaseDescription: true, //是否显示更新description，默认为false
            descriptionPrefix: '更新内容：', //更新说明的前缀。 默认是” Description:
            mandatoryContinueButtonLabel: '立即更新', //强制更新的按钮文字，默认为continue
            mandatoryUpdateMessage: '', //- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
            optionalIgnoreButtonLabel: '稍后', //非强制更新时，取消按钮文字,默认是ignore
            optionalInstallButtonLabel: '后台更新', //非强制更新时，确认文字. Defaults to “Install”
            optionalUpdateMessage: '有新版本了，是否更新？', //非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
            title: '发现新版本', //要显示的更新通知的标题. Defaults to “Update available”.
        },
      },
      this.syncStatusChangedCallback.bind(this),
      this.downloadProgressCallback.bind(this),
    );
  }
  componentDidMount(): void {
    
  }
  syncStatusChangedCallback(syncStatus:number){//当同步过程在整个更新过程中从一个阶段移动到另一个阶段时调用。
    console.log('----------->>>',syncStatus);
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:// 5 检查更新
          this.setState({syncMessage: '检查更新'});
          break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE: // 7 正在下载程序包。
          this.setState({syncMessage: '正在下载程序包。',progressModalVisible:true});
          break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION: // 6 正在等待用户操作。
          this.setState({syncMessage: '正在等待用户操作。'});
          break;
      case CodePush.SyncStatus.INSTALLING_UPDATE: // 8 正在安装更新。
          this.setState({syncMessage: '正在安装更新。',progressModalVisible:true});
          break;
      case CodePush.SyncStatus.UP_TO_DATE: // 0 应用程序是最新的。
          this.setState({syncMessage: '应用程序是最新的。', progressValue: false});
          // Alert.alert("Title",
          // "Alert Msg",
          // [
          //   {
          //     text: "",
          //     onPress: () => console.log("以后")
          //   },
          //   {
          //     text: "取消",
          //     onPress: () => console.log("取消"),
          //     style: "cancel"
          //   },
          //   { text: "确定", onPress: () => console.log("确定") }
          // ])
          break;
      case CodePush.SyncStatus.UPDATE_IGNORED: // 2 用户取消了更新。
          this.setState({syncMessage: '用户取消了更新。', progressValue: false,});
          break;
      case CodePush.SyncStatus.UPDATE_INSTALLED: // 1 更新已安装，将在重新启动时应用。
          this.setState({syncMessage: '更新已安装，将在重新启动时应用。', progress: false,});
          break;
      case CodePush.SyncStatus.UNKNOWN_ERROR: // 3 出现未知错误。
          this.setState({syncMessage: '出现未知错误。', progressValue: false,});
          break;
    }
  }

  downloadProgressCallback(progress:any){
    console.log('progress=======>>>',progress);
    this.setState({
      progressValue: progress
    })
  }

  render(){
    let progressView;
    if (this.state.progressValue) {
        let total:any = (this.state.progressValue.totalBytes/(1024*1024)).toFixed(2);
        let received:any =(this.state.progressValue.receivedBytes/(1024*1024)).toFixed(2);
        let progress:any = parseInt(((received/total)*100).toString());

        console.log('total-received-progress====>>>',this.state.progressValue,total,received,progress);

        progressView = (
            <ProgressBarModal
                progress={progress}
                totalPackageSize={total}
                receivedPackageSize={received}
                progressModalVisible={this.state.progressModalVisible}
            />
        );
    }
    return <SafeAreaView>
      <StatusBar/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <Header />
        <Text>更新成功666===666==123888--12345---666--777-88-00--111</Text>
        <Text>信息：{this.state.syncMessage}</Text>
        <Text>进度：{this.state.progressValue && JSON.stringify(this.state.progressValue)}</Text>
        <TouchableOpacity 
        style={{marginTop: 50}}
        onPress={()=>{
          this.checkUpdate()
        }}>
          <Text>点击检查更新</Text>
        </TouchableOpacity>
        { progressView }
      </ScrollView>
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
let codePushOptions = { 
  // checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  checkFrequency: CodePush.CheckFrequency.MANUAL
};
const Myapp = CodePush(codePushOptions)(App)
export default Myapp;

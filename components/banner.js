import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { View } from "react-native";

export default function ABanner() {
  return (
    <View>
      <BannerAd
        //unitId={"ca-app-pub-3818927199662677/3221934793"}
        // TEST
        unitId={"ca-app-pub-3818927199662677/7377204789"}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

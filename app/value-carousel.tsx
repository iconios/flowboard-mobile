import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";

const ValueCarousel = () => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const CAROUSEL_HEIGHT = height * 0.8;
  const router = useRouter();

  const data = [
    {
      id: 1,
      title: "Your ideas, organized visually",
      description: "Create sticky notes, tasks, and lists all on one canvas.",
      button: "Get Started",
      image: require("../assets/images/organized.png"),
    },
    {
      id: 2,
      title: "Keep everyone on the same page",
      description:
        "Collaborate in real-time and see updates instantly, wherever your team members are.",
      button: "Start Collaborating",
      image: require("../assets/images/same-page.png"),
    },
    {
      id: 3,
      title: "Move work forward from anywhere",
      description:
        "Capture ideas on the go and turn them into action with a few taps.",
      button: "Start Flowing",
      image: require("../assets/images/anywhere.png"),
    },
  ];

  // Line Dot Indicators Component
  const LineDotIndicators = ({
    data,
    activeIndex,
  }: {
    data: any[];
    activeIndex: number;
  }) => {
    return (
      <View style={styles.lineDotsContainer}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              carouselRef.current?.scrollTo({ index });
              setCurrentIndex(index);
            }}
            activeOpacity={0.7}
            style={styles.lineDotTouchable}
          >
            <View
              style={[
                styles.lineDot,
                index === activeIndex && styles.lineActiveDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: {
      id: number;
      title: string;
      description: string;
      button: string;
      image: ImageSourcePropType;
    };
    index: number;
  }) => (
    <View style={styles.slideContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          resizeMode="contain"
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => router.replace("/")}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {item.button}
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={CAROUSEL_HEIGHT}
        data={data}
        onSnapToItem={setCurrentIndex}
        renderItem={renderItem}
      />

      {/* Dots Indicators - placed outside carousel */}
      <View style={styles.dotsContainer}>
        <LineDotIndicators data={data} activeIndex={currentIndex} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageStyle: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
  },
  textView: {
    paddingVertical: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4338ca",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 28,
    width: "100%",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  // Dots Container
  dotsContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  // Line Dot Styles
  lineDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lineDotTouchable: {
    marginHorizontal: 6,
  },
  lineDot: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CCCCCC",
  },
  lineActiveDot: {
    backgroundColor: "#4338ca",
    width: 28,
  },
});

export default ValueCarousel;

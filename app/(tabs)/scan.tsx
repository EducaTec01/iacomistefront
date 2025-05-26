import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, X, CircleCheck as CheckCircle, ChevronRight } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { useAppContext } from '../../context/AppContext';
import { Ingredient } from '../../types';
import { uploadImage } from '../../services/scannings'; // ajusta la ruta si es diferente


export default function ScanScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIngredients, setScannedIngredients] = useState<Ingredient[]>([]);
  const cameraRef = useRef(null);
  const { setScannedIngredients: saveScannedIngredients } = useAppContext();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        // @ts-ignore - Type is actually correct but TypeScript doesn't know
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        setShowCamera(false);
        handleScanImage(photo.uri);
      } catch (e) {
        console.error('Error taking picture:', e);
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        handleScanImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error picking image:', e);
    }
  };


  const handleScanImage = async (imageUri: string) => {
    try {
      setIsScanning(true); // muestra el spinner

      const result = await uploadImage(imageUri);

      // Suponiendo que los ingredientes vienen como string separados por comas
      const ingredientsArray = result.ingredients.split(',').map((name: string, index: number) => ({
        id: index.toString(),
        name: name.trim(),
      }));

      setScannedIngredients(ingredientsArray);
    } catch (error) {
      console.error('Error al escanear imagen:', error);
    } finally {
      setIsScanning(false);
    }
  };


  const handleRemoveIngredient = (id: string) => {
    setScannedIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
  };

  const handleFindRecipes = () => {
    saveScannedIngredients(scannedIngredients);
    router.push('/recipes');
  };

  const handleReset = () => {
    setImage(null);
    setScannedIngredients([]);
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          onMountError={(error) => console.error('Camera error:', error)}
        >
          <View style={styles.cameraControlsContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseCamera}
            >
              <X size={24} color={Colors.neutral.white} />
            </TouchableOpacity>

            <View style={styles.cameraButtonsRow}>
              <TouchableOpacity
                style={styles.flipCameraButton}
                onPress={toggleCameraType}
              >
                <Camera size={24} color={Colors.neutral.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.takePictureButton}
                onPress={handleTakePicture}
              />

              <View style={{ width: 50 }} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Scan Ingredients</Text>
        <Text style={styles.subtitle}>
          Take a photo of your ingredients to get recipe suggestions
        </Text>

        {!image ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleOpenCamera}
            >
              <View style={styles.optionIconContainer}>
                <Camera size={32} color={Colors.primary.default} />
              </View>
              <Text style={styles.optionText}>Take Photo</Text>
              <Text style={styles.optionSubtext}>
                Use camera to capture ingredients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handlePickImage}
            >
              <View style={styles.optionIconContainer}>
                <ImageIcon size={32} color={Colors.primary.default} />
              </View>
              <Text style={styles.optionText}>Upload Image</Text>
              <Text style={styles.optionSubtext}>
                Choose from your gallery
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <X size={20} color={Colors.neutral.white} />
              </TouchableOpacity>
            </View>

            {isScanning ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.default} />
                <Text style={styles.loadingText}>Identifying ingredients...</Text>
              </View>
            ) : (
              <>
                <View style={styles.ingredientsContainer}>
                  <Text style={styles.ingredientsTitle}>Identified Ingredients</Text>

                  {scannedIngredients.length > 0 ? (
                    scannedIngredients.map((ingredient) => (
                      <View key={ingredient.id} style={styles.ingredientRow}>
                        <View style={styles.ingredientInfo}>
                          <CheckCircle size={16} color={Colors.success.default} style={styles.ingredientIcon} />
                          <Text style={styles.ingredientName}>{ingredient.name}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveIngredient(ingredient.id)}
                        >
                          <X size={16} color={Colors.neutral[600]} />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noIngredientsText}>
                      No ingredients detected. Try another image.
                    </Text>
                  )}
                </View>

                {scannedIngredients.length > 0 && (
                  <Button
                    title="Find Recipes"
                    onPress={handleFindRecipes}
                    variant="primary"
                    size="large"
                    style={styles.findRecipesButton}
                    icon={<ChevronRight size={20} color={Colors.neutral.white} />}
                  />
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 24,
  },
  optionButton: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  optionSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.black,
  },
  camera: {
    flex: 1,
  },
  cameraControlsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    marginTop: Platform.OS === 'android' ? 40 : 10,
  },
  cameraButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  flipCameraButton: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  },
  takePictureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.neutral.white,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  resultContainer: {
    marginTop: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resetButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 16,
  },
  ingredientsContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientIcon: {
    marginRight: 12,
  },
  ingredientName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: 8,
  },
  noIngredientsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    padding: 16,
  },
  findRecipesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
});
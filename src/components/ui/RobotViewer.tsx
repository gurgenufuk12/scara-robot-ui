import { useRef, useState, Suspense, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card } from "@/components/ui/Card";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

// Model Bileşeni - OBJ yükleme ve animasyon işlemlerini gerçekleştirir
interface ModelProps {
  jointValues: number[];
  modelPath: string;
  axisCount: number;
}
// Model bileşenini güncelleyin:
// Model bileşenini güncelleyin:
function Model({ jointValues, modelPath }: ModelProps) {
  const objRef = useRef<THREE.Group>(null);
  const obj = useLoader(OBJLoader, modelPath) as THREE.Group;

  // Debug için state'ler
  const [initialized, setInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Robot eklemi grupları için referanslar
  const baseJointRef = useRef<THREE.Group>(null);
  const arm1JointRef = useRef<THREE.Group>(null);

  // İlk yükleme ve model yapılandırması
  useEffect(() => {
    // Burada objRef.current'i dependency array'den çıkardık
    if (initialized) return; // Zaten başlatılmışsa, tekrar çalışma
    
    const setupModel = () => {
      if (!objRef.current) return false;
      
      try {
        console.log("Model kurulumu başlatılıyor...");
        
        // Önce mevcut modeli klonla
        const robotModel = obj.clone();

        // Tüm meshleri çıkar ve bilgilerini topla
        const meshes: THREE.Mesh[] = [];
        robotModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshes.push(child as THREE.Mesh);
          }
        });

        console.log(`Model yüklendi. ${meshes.length} mesh bulundu.`);

        // Orijinal modelden tüm çocukları kaldır
        while (objRef.current.children.length > 0) {
          objRef.current.remove(objRef.current.children[0]);
        }

        // Ana robot tabanı grubu
        const baseJoint = new THREE.Group();
        baseJoint.name = "base_joint";
        baseJointRef.current = baseJoint;

        // İlk eklem/kol grubu
        const arm1Joint = new THREE.Group();
        arm1Joint.name = "arm1_joint";
        arm1JointRef.current = arm1Joint;

        // Modeli parçalara ayır
        if (meshes.length >= 2) {
          // İlk parçayı taban olarak kullan
          baseJoint.add(meshes[0]);
          
          // Varsayılan materyal ekle
          if (meshes[0].material) {
            meshes[0].material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.2, 0.3, 0.8), // Mavi
              metalness: 0.5,
              roughness: 0.3
            });
          }

          // İkinci parçayı kol olarak kullan
          arm1Joint.add(meshes[1]);
          if (meshes[1].material) {
            meshes[1].material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.8, 0.3, 0.2), // Turuncu
              metalness: 0.5,
              roughness: 0.3
            });
          }

          // Yardımcı eksenler ekle (debug için)
          const axesHelper = new THREE.AxesHelper(2);
          baseJoint.add(axesHelper);

          const arm1AxesHelper = new THREE.AxesHelper(1);
          arm1Joint.add(arm1AxesHelper);

          // Dönüş noktalarını ayarla - Bu değerleri modele göre ayarlamanız gerekebilir
          meshes[0].position.set(0, 0, 0);
          meshes[1].position.set(0, 0, 0);

          // Eklem bağlantısını oluştur
          baseJoint.add(arm1Joint);

          // Ana nesneye ekle
          objRef.current.add(baseJoint);

          console.log("Model kurulumu tamamlandı, initialized true olarak ayarlanıyor.");
          setDebugInfo("Robot modeli başarıyla yapılandırıldı.");
          
          // Başarılı yapılandırma
          return true;
        } else {
          console.error(`Hata: Model en az 2 mesh içermelidir. Bulunan: ${meshes.length}`);
          setDebugInfo(`Hata: Model en az 2 mesh içermelidir. Bulunan: ${meshes.length}`);
          return false;
        }
      } catch (error) {
        console.error("Model kurulumu hatası:", error);
        setDebugInfo(`Hata: ${error.message}`);
        return false;
      }
    };
    
    // Setup çağrısı ve sonucu kontrol et
    const success = setupModel();
    if (success) {
      setInitialized(true);
    }
    
  }, [obj, initialized]); // objRef.current'i buradan çıkardık

  // Debug için initialized durumunu izle
  useEffect(() => {
    console.log("initialized değeri değişti:", initialized);
  }, [initialized]);
  
  // Eklem açılarını güncelle
  useFrame(() => {
    if (!initialized) {
      console.log("useFrame: initialized değeri false, rotasyonlar uygulanmıyor.");
      return;
    }

    try {
      // Taban eklemini döndür (Y ekseni genellikle taban dönüşü için kullanılır)
      if (baseJointRef.current) {
        baseJointRef.current.rotation.y = THREE.MathUtils.degToRad(
          jointValues[0] || 0
        );
        console.log("Taban rotasyonu uygulandı:", jointValues[0]);
      }

      // Kol eklemini döndür (Z ekseni genellikle kol kaldırma için kullanılır)
      if (arm1JointRef.current) {
        arm1JointRef.current.rotation.z = THREE.MathUtils.degToRad(
          jointValues[1] || 0
        );
        console.log("Kol rotasyonu uygulandı:", jointValues[1]);
      }
    } catch (error) {
      console.error("Rotasyon hatası:", error);
      setDebugInfo(`Rotasyon hatası: ${error.message}`);
    }
  });

  return (
    <group ref={objRef}>
      {/* Debugger - bu kısım HTML içerir */}
      <Html position={[0, 2, 0]} className="pointer-events-none">
        <div className="bg-black bg-opacity-70 text-white p-2 rounded text-xs">
          <div>Initialized: {initialized ? "true" : "false"}</div>
          <div>J1: {jointValues[0]}° (Y ekseni)</div>
          <div>J2: {jointValues[1]}° (Z ekseni)</div>
          <div>{debugInfo}</div>
        </div>
      </Html>
    </group>
  );
}

// Ana RobotViewer bileşeni
export default function RobotViewer() {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;
  const jointValues = selectedRobot ? selectedRobot.jointValues : [];

  // OBJ model dosya yolu - public klasörü içinde olmalı
  const modelPath = "/scara.obj"; // OBJ dosyanızın gerçek yolunu girin

  // Hata durumları için state
  const [error, setError] = useState<null | { message: string }>(null);

  // Camera settings
  const [cameraPosition] = useState<[number, number, number]>(() => [5, 5, 5]);

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">
          Robot Görselleştirme
          {axisCount > 0 && (
            <span className="ml-2 bg-blue-900 px-2 py-0.5 text-xs rounded-full">
              {axisCount} Eksen
            </span>
          )}
        </h2>
        {selectedRobotId && (
          <div className="bg-blue-900 px-3 py-1 rounded-md text-blue-200">
            Robot: {selectedRobot?.name || selectedRobotId}
          </div>
        )}
      </div>

      {!selectedRobotId ? (
        <div className="text-center text-gray-400 py-8">
          Lütfen bir robot seçin
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-gray-700">
          <div className="h-96 w-full relative">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-gray-800 bg-opacity-75">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="font-bold">Hata:</p>
                  <p>{error.message}</p>
                </div>
              </div>
            )}

            <Canvas
              onError={(e) =>
                setError({ message: e.type || "An error occurred" })
              }
              shadows
            >
              {/* Kamera ayarları */}
              <PerspectiveCamera
                makeDefault
                position={cameraPosition}
                fov={45}
              />

              {/* Işık kaynakları */}
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              {/* Zemin ızgarası */}
              <gridHelper args={[10, 10, "#444444", "#222222"]} />

              {/* 3D Model */}
              <Suspense
                fallback={
                  <Html center>
                    <div className="bg-gray-800 p-3 rounded-lg text-blue-300">
                      <div className="animate-pulse">Model yükleniyor...</div>
                    </div>
                  </Html>
                }
              >
                <Model
                  jointValues={jointValues}
                  modelPath={modelPath}
                  axisCount={axisCount}
                />
              </Suspense>

              {/* Kullanıcı kontrolleri - fare ile dönüş, zoom yapma */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={100}
              />
            </Canvas>
          </div>

          {/* Eksen değerleri tablosu */}
          <div className="mt-8 bg-gray-800 p-3 rounded-lg w-full max-w-md mx-auto">
            <h3 className="text-sm text-gray-400 mb-2">
              Mevcut Eksen Değerleri
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {jointValues.map((value, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-700 p-2 rounded"
                >
                  <span className="text-xs text-gray-300">
                    Eksen {index + 1}
                  </span>
                  <span className="text-xs text-blue-300 font-mono">
                    {value}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

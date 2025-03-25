import { Tabs, TabsContent } from "@/components/ui/Tabs";
import JointControl from "./JointControl";
import CartesianControl from "./CartesianControl";
import { RobotViewer } from "./RobotViewer";

export default function TabMenu({ selectedRobot }: { selectedRobot: string }) {
  return (
    <Tabs
      defaultValue="Joint Control"
      className="w-full"
      tabs={[
        {
          label: "Joint Control",
          content: <JointControl selectedRobot={selectedRobot} />,
        },
        {
          label: "Cartesian Control",
          content: <CartesianControl selectedRobot={selectedRobot} />,
        },
        {
          label: "View",
          content: <RobotViewer selectedRobot={selectedRobot} />,
        },
        {
          label: "Settings",
          content: <p className="p-4">Buraya parametre ayarları gelecek.</p>,
        },
        {
          label: "Logs",
          content: (
            <p className="p-4">
              Buraya loglar ve diagnostik bilgileri eklenecek.
            </p>
          ),
        },
      ]}
    >
      <TabsContent value="Joint Control">
        <JointControl selectedRobot={selectedRobot} />
      </TabsContent>
      <TabsContent value="Cartesian Control">
        <CartesianControl selectedRobot={selectedRobot} />
      </TabsContent>
      <TabsContent value="View">
        <RobotViewer selectedRobot={selectedRobot} />
      </TabsContent>
      <TabsContent value="Settings">
        <p className="p-4">Buraya parametre ayarları gelecek.</p>
      </TabsContent>
      <TabsContent value="Logs">
        <p className="p-4">Buraya loglar ve diagnostik bilgileri eklenecek.</p>
      </TabsContent>
    </Tabs>
  );
}

import * as React from "react";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  tabs?: { label: string; content: React.ReactNode }[];
}

export function Tabs({ defaultValue, children, className, tabs }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={`tabs ${className}`}>
      {tabs ? (
        <TabsList activeTab={activeTab} setActiveTab={setActiveTab}>
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.label}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      ) : (
        children
      )}

      {tabs ? (
        tabs.map((tab, index) => (
          <TabsContent key={index} value={tab.label} activeTab={activeTab}>
            {tab.content}
          </TabsContent>
        ))
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

export function TabsList({
  children,
  activeTab,
  setActiveTab,
  className,
}: TabsListProps) {
  return (
    <div className={`tabs-list flex gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<TabsListProps>, {
              activeTab,
              setActiveTab,
            })
          : child
      )}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  activeTab,
  setActiveTab,
  children,
  className,
}: TabsTriggerProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md ${
        activeTab === value
          ? "bg-green-700 text-white"
          : "bg-gray-600 text-gray-300"
      } ${className}`}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  activeTab,
  children,
  className,
}: TabsContentProps) {
  return activeTab === value ? (
    <div className={`p-4 ${className}`}>{children}</div>
  ) : null;
}

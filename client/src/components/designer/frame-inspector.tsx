import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Code2, 
  Layers, 
  Ruler,
  Palette,
  Type,
  Square,
  Image as ImageIcon
} from "lucide-react";

interface FrameAnalysis {
  name: string;
  route: string;
  elements: {
    type: string;
    className: string;
    content: string;
    position: { x: number; y: number; width: number; height: number };
    styles: Record<string, string>;
  }[];
  structure: string;
  colors: string[];
  typography: string[];
}

const currentFrames: FrameAnalysis[] = [
  {
    name: "Team Login Page",
    route: "/",
    elements: [
      {
        type: "container",
        className: "min-h-screen bg-[#fff5ad] flex items-center justify-center p-4",
        content: "Main container with yellow background",
        position: { x: 0, y: 0, width: 1200, height: 800 },
        styles: {
          backgroundColor: "#fff5ad",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }
      },
      {
        type: "logo-frame",
        className: "rounded-t-lg p-6 text-center bg-[#fff5ad]",
        content: "Logo container with Cash or Crash image",
        position: { x: 400, y: 100, width: 384, height: 256 },
        styles: {
          backgroundColor: "#fff5ad",
          borderRadius: "0.5rem 0.5rem 0 0",
          padding: "24px",
          textAlign: "center"
        }
      },
      {
        type: "logo-image",
        className: "mx-auto object-contain drop-shadow-sm",
        content: "Cash or Crash logo image",
        position: { x: 500, y: 150, width: 192, height: 128 },
        styles: {
          width: "192px",
          height: "128px",
          margin: "0 auto",
          objectFit: "contain",
          filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))"
        }
      },
      {
        type: "login-card",
        className: "rounded-t-none rounded-b-lg bg-[#fbf7eb] border-none shadow-sm",
        content: "Login form card",
        position: { x: 400, y: 356, width: 384, height: 280 },
        styles: {
          backgroundColor: "#fbf7eb",
          borderRadius: "0 0 0.5rem 0.5rem",
          border: "none",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
        }
      },
      {
        type: "title-text",
        className: "text-[#c7a230] text-[20px] font-bold",
        content: "TAKIM GİRİŞİ",
        position: { x: 500, y: 380, width: 200, height: 40 },
        styles: {
          color: "#c7a230",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center"
        }
      },
      {
        type: "input-field",
        className: "w-full border rounded px-3 py-2",
        content: "Access code input field",
        position: { x: 420, y: 440, width: 344, height: 40 },
        styles: {
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
          padding: "8px 12px"
        }
      },
      {
        type: "login-button",
        className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
        content: "Takıma Giriş Yap",
        position: { x: 420, y: 500, width: 344, height: 44 },
        styles: {
          width: "100%",
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          padding: "10px 16px",
          borderRadius: "0.375rem"
        }
      },
      {
        type: "designer-button",
        className: "w-full border border-gray-300 bg-white",
        content: "🎨 Visual UI Designer",
        position: { x: 420, y: 580, width: 344, height: 44 },
        styles: {
          width: "100%",
          border: "1px solid #d1d5db",
          backgroundColor: "#ffffff",
          padding: "10px 16px",
          borderRadius: "0.375rem"
        }
      }
    ],
    structure: `
    <div className="main-container">
      <div className="content-wrapper">
        <div className="logo-frame">
          <img className="logo" />
        </div>
        <Card className="login-card">
          <CardHeader>
            <p className="title">TAKIM GİRİŞİ</p>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="Erişim Kodu" />
              <Button>Takıma Giriş Yap</Button>
            </form>
            <Button>🎨 Visual UI Designer</Button>
          </CardContent>
        </Card>
      </div>
    </div>`,
    colors: ["#fff5ad", "#fbf7eb", "#c7a230", "#ffffff", "#d1d5db"],
    typography: ["20px bold", "16px normal", "14px normal"]
  },
  {
    name: "Team Dashboard",
    route: "/team/:id",
    elements: [
      {
        type: "main-container",
        className: "min-h-screen bg-background",
        content: "Dashboard main container",
        position: { x: 0, y: 0, width: 1200, height: 800 },
        styles: {
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))"
        }
      },
      {
        type: "header",
        className: "bg-card shadow-sm border-b",
        content: "Dashboard header with team selector",
        position: { x: 0, y: 0, width: 1200, height: 64 },
        styles: {
          backgroundColor: "hsl(var(--card))",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          borderBottom: "1px solid hsl(var(--border))",
          height: "64px"
        }
      },
      {
        type: "navigation-tabs",
        className: "border-b border-border",
        content: "Navigation tabs for Stocks, Currency, Startup",
        position: { x: 0, y: 64, width: 1200, height: 48 },
        styles: {
          borderBottom: "1px solid hsl(var(--border))",
          height: "48px"
        }
      },
      {
        type: "main-content",
        className: "p-6",
        content: "Main dashboard content area",
        position: { x: 0, y: 112, width: 1200, height: 688 },
        styles: {
          padding: "24px",
          height: "calc(100vh - 112px)"
        }
      }
    ],
    structure: `
    <div className="dashboard-container">
      <Header selectedTeamId={teamId} onTeamChange={setTeamId} />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'stocks' && <StockMarketDesk teamId={teamId} />}
        {activeTab === 'currency' && <CurrencyDesk teamId={teamId} />}
        {activeTab === 'startup' && <StartupDesk teamId={teamId} />}
      </main>
    </div>`,
    colors: ["hsl(var(--background))", "hsl(var(--card))", "hsl(var(--border))"],
    typography: ["24px bold", "18px semibold", "16px normal", "14px normal"]
  },
  {
    name: "Admin Panel",
    route: "/admin",
    elements: [
      {
        type: "main-container",
        className: "min-h-screen bg-background",
        content: "Admin panel container",
        position: { x: 0, y: 0, width: 1200, height: 800 },
        styles: {
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))"
        }
      },
      {
        type: "header",
        className: "bg-card shadow-sm border-b",
        content: "Admin header with navigation",
        position: { x: 0, y: 0, width: 1200, height: 64 },
        styles: {
          backgroundColor: "hsl(var(--card))",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          borderBottom: "1px solid hsl(var(--border))",
          height: "64px"
        }
      },
      {
        type: "tabs-container",
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        content: "Management tabs container",
        position: { x: 100, y: 80, width: 1000, height: 600 },
        styles: {
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 16px"
        }
      }
    ],
    structure: `
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <Link href="/">Back to Dashboard</Link>
          <h1>Admin Panel</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="admin-main">
        <Tabs>
          <TabsList>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent>{/* Management content */}</TabsContent>
        </Tabs>
      </main>
    </div>`,
    colors: ["hsl(var(--background))", "hsl(var(--card))", "hsl(var(--muted))"],
    typography: ["24px bold", "18px semibold", "16px normal", "14px normal"]
  }
];

export function FrameInspector() {
  const [selectedFrame, setSelectedFrame] = useState<FrameAnalysis>(currentFrames[0]);
  const [inspectionMode, setInspectionMode] = useState<'visual' | 'structure' | 'details'>('visual');

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Frame List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Current App Frames</h3>
        <div className="space-y-3">
          {currentFrames.map((frame, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-colors ${
                selectedFrame.name === frame.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedFrame(frame)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{frame.name}</CardTitle>
                <Badge variant="outline" className="text-xs w-fit">
                  {frame.route}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3 h-3" />
                    {frame.elements.length} elements
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    {frame.colors.length} colors
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Inspection Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Inspecting: {selectedFrame.name}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={inspectionMode === 'visual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInspectionMode('visual')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visual
              </Button>
              <Button
                variant={inspectionMode === 'structure' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInspectionMode('structure')}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Structure
              </Button>
              <Button
                variant={inspectionMode === 'details' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInspectionMode('details')}
              >
                <Ruler className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {inspectionMode === 'visual' && (
            <div className="p-8">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="relative" style={{ width: '800px', height: '500px', margin: '0 auto' }}>
                  {selectedFrame.elements.map((element, index) => (
                    <div
                      key={index}
                      className="absolute border border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer group"
                      style={{
                        left: `${(element.position.x / 1200) * 800}px`,
                        top: `${(element.position.y / 800) * 500}px`,
                        width: `${(element.position.width / 1200) * 800}px`,
                        height: `${(element.position.height / 800) * 500}px`,
                        backgroundColor: element.styles.backgroundColor || 'transparent',
                        borderRadius: element.styles.borderRadius || '0',
                      }}
                      title={element.content}
                    >
                      <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {element.type}
                      </div>
                      <div className="p-2 text-xs truncate" style={{ color: element.styles.color || '#000' }}>
                        {element.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {inspectionMode === 'structure' && (
            <div className="p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
                {selectedFrame.structure}
              </pre>
            </div>
          )}

          {inspectionMode === 'details' && (
            <div className="p-6">
              <Tabs defaultValue="elements" className="w-full">
                <TabsList>
                  <TabsTrigger value="elements">Elements</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>

                <TabsContent value="elements" className="space-y-4">
                  {selectedFrame.elements.map((element, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {element.type.includes('text') && <Type className="w-4 h-4" />}
                          {element.type.includes('image') && <ImageIcon className="w-4 h-4" />}
                          {element.type.includes('container') || element.type.includes('card') || element.type.includes('button') ? <Square className="w-4 h-4" /> : null}
                          <CardTitle className="text-sm">{element.type}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm">
                          <p><strong>Content:</strong> {element.content}</p>
                          <p><strong>Position:</strong> {element.position.x}, {element.position.y}</p>
                          <p><strong>Size:</strong> {element.position.width} × {element.position.height}</p>
                          <p><strong>Class:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{element.className}</code></p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div className="grid grid-cols-5 gap-4">
                    {selectedFrame.colors.map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-16 h-16 rounded border shadow-sm mx-auto mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <code className="text-xs">{color}</code>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-4">
                  {selectedFrame.typography.map((typo, index) => (
                    <div key={index} className="p-4 border rounded">
                      <div style={{ 
                        fontSize: typo.split(' ')[0], 
                        fontWeight: typo.split(' ')[1] 
                      }}>
                        Sample text with {typo}
                      </div>
                      <code className="text-xs text-muted-foreground">{typo}</code>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
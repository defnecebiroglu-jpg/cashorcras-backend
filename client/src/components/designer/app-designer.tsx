import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Square, 
  Type, 
  Image as ImageIcon, 
  CreditCard,
  Users,
  BarChart3,
  Settings,
  Eye,
  Code,
  Save,
  Upload,
  Download
} from "lucide-react";
import { VisualDesigner, DesignElement } from "./visual-designer";
import logoImage from "@assets/cash-or-crash-logo.png";

interface AppTemplate {
  id: string;
  name: string;
  description: string;
  elements: DesignElement[];
}

const predefinedTemplates: AppTemplate[] = [
  {
    id: "login-page",
    name: "Team Login Page",
    description: "Design the main login interface",
    elements: [
      {
        id: "logo-container",
        type: "image",
        x: 150,
        y: 50,
        width: 200,
        height: 100,
        content: "Cash or Crash Logo",
        backgroundColor: "#fff5ad",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 8,
        padding: 20,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "login-card",
        type: "box",
        x: 100,
        y: 180,
        width: 300,
        height: 280,
        content: "Login Form Container",
        backgroundColor: "#fbf7eb",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: 20,
        margin: 0,
        opacity: 1,
        zIndex: 2
      },
      {
        id: "title-text",
        type: "text",
        x: 150,
        y: 200,
        width: 200,
        height: 40,
        content: "TAKIM GİRİŞİ",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        fontSize: 20,
        fontWeight: "bold",
        textColor: "#c7a230",
        borderRadius: 0,
        padding: 0,
        margin: 0,
        opacity: 1,
        zIndex: 3
      },
      {
        id: "input-field",
        type: "box",
        x: 120,
        y: 260,
        width: 260,
        height: 40,
        content: "Access Code Input",
        backgroundColor: "#ffffff",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        margin: 0,
        opacity: 1,
        zIndex: 3
      },
      {
        id: "login-button",
        type: "box",
        x: 120,
        y: 320,
        width: 260,
        height: 44,
        content: "Takıma Giriş Yap",
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        margin: 0,
        opacity: 1,
        zIndex: 3
      }
    ]
  },
  {
    id: "dashboard",
    name: "Team Dashboard",
    description: "Design the main dashboard layout",
    elements: [
      {
        id: "header",
        type: "box",
        x: 0,
        y: 0,
        width: 800,
        height: 60,
        content: "Dashboard Header",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 0,
        borderRadius: 0,
        padding: 16,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "sidebar",
        type: "box",
        x: 0,
        y: 60,
        width: 250,
        height: 440,
        content: "Navigation Sidebar",
        backgroundColor: "#f9fafb",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 0,
        padding: 20,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "main-content",
        type: "box",
        x: 250,
        y: 60,
        width: 550,
        height: 440,
        content: "Main Content Area",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 0,
        borderRadius: 0,
        padding: 24,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "portfolio-card",
        type: "box",
        x: 280,
        y: 100,
        width: 240,
        height: 120,
        content: "Portfolio Overview",
        backgroundColor: "#f3f4f6",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        margin: 0,
        opacity: 1,
        zIndex: 2
      },
      {
        id: "stats-card",
        type: "box",
        x: 540,
        y: 100,
        width: 240,
        height: 120,
        content: "Statistics",
        backgroundColor: "#f3f4f6",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        margin: 0,
        opacity: 1,
        zIndex: 2
      }
    ]
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    description: "Design the admin interface",
    elements: [
      {
        id: "admin-header",
        type: "box",
        x: 0,
        y: 0,
        width: 800,
        height: 70,
        content: "Admin Panel Header",
        backgroundColor: "#1f2937",
        borderColor: "#374151",
        borderWidth: 1,
        borderRadius: 0,
        padding: 20,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "admin-title",
        type: "text",
        x: 20,
        y: 15,
        width: 200,
        height: 40,
        content: "Admin Dashboard",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        fontSize: 24,
        fontWeight: "bold",
        textColor: "#ffffff",
        borderRadius: 0,
        padding: 0,
        margin: 0,
        opacity: 1,
        zIndex: 2
      },
      {
        id: "tabs-container",
        type: "box",
        x: 20,
        y: 90,
        width: 760,
        height: 50,
        content: "Management Tabs",
        backgroundColor: "#f9fafb",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        margin: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: "content-area",
        type: "box",
        x: 20,
        y: 160,
        width: 760,
        height: 320,
        content: "Management Content",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        padding: 24,
        margin: 0,
        opacity: 1,
        zIndex: 1
      }
    ]
  }
];

export function AppDesigner() {
  const [currentTemplate, setCurrentTemplate] = useState<AppTemplate>(predefinedTemplates[0]);
  const [designElements, setDesignElements] = useState<DesignElement[]>(predefinedTemplates[0].elements);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleDesignChange = useCallback((elements: DesignElement[]) => {
    setDesignElements(elements);
  }, []);

  const loadTemplate = useCallback((template: AppTemplate) => {
    setCurrentTemplate(template);
    setDesignElements(template.elements);
  }, []);

  const saveDesign = useCallback(() => {
    const designData = {
      templateId: currentTemplate.id,
      elements: designElements,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for persistence
    localStorage.setItem(`app-design-${currentTemplate.id}`, JSON.stringify(designData));
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(designData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.name.toLowerCase().replace(/\s+/g, '-')}-design.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentTemplate, designElements]);

  const loadSavedDesign = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const designData = JSON.parse(e.target?.result as string);
        setDesignElements(designData.elements);
        // Find matching template or create custom one
        const template = predefinedTemplates.find(t => t.id === designData.templateId) || currentTemplate;
        setCurrentTemplate(template);
      } catch (error) {
        console.error('Failed to load design:', error);
      }
    };
    reader.readAsText(file);
  }, [currentTemplate]);

  const generateReactCode = useCallback(() => {
    const componentName = currentTemplate.name.replace(/\s+/g, '');
    const elements = designElements.map(el => {
      const style = {
        position: 'absolute' as const,
        left: `${el.x}px`,
        top: `${el.y}px`,
        width: `${el.width}px`,
        height: `${el.height}px`,
        backgroundColor: el.backgroundColor,
        border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : 'none',
        borderRadius: `${el.borderRadius}px`,
        padding: `${el.padding}px`,
        margin: `${el.margin}px`,
        opacity: el.opacity,
        zIndex: el.zIndex,
        ...(el.type === 'text' && {
          fontSize: `${el.fontSize}px`,
          fontWeight: el.fontWeight,
          color: el.textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
      };

      const styleString = JSON.stringify(style, null, 2);
      return `    <div style={${styleString}}>${el.content || ''}</div>`;
    }).join('\n');

    return `import React from 'react';

export function ${componentName}() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
${elements}
    </div>
  );
}

export default ${componentName};`;
  }, [currentTemplate.name, designElements]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Header */}
      <header className="bg-card shadow-sm border-b border-border px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">App UI Designer</h1>
            <span className="text-sm text-muted-foreground">
              Designing: {currentTemplate.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveDesign}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('load-design')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Load Design
            </Button>
            <input
              id="load-design"
              type="file"
              accept=".json"
              onChange={loadSavedDesign}
              className="hidden"
            />
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Template Selector Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">App Templates</h3>
              <div className="space-y-2">
                {predefinedTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      currentTemplate.id === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => loadTemplate(template)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Square className="w-3 h-3 mr-1" />
                        {template.elements.length} elements
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const code = generateReactCode();
                    navigator.clipboard.writeText(code);
                  }}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Copy React Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const code = generateReactCode();
                    const blob = new Blob([code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentTemplate.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Component
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Current Design Info</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Elements:</span>
                  <span>{designElements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span>{currentTemplate.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Designer */}
        <div className="flex-1">
          {isPreviewMode ? (
            <div className="h-full bg-gray-50 p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative" style={{ height: '500px' }}>
                    {designElements.map((element) => (
                      <div
                        key={element.id}
                        className="absolute"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          backgroundColor: element.backgroundColor,
                          border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
                          borderRadius: element.borderRadius,
                          padding: element.padding,
                          margin: element.margin,
                          opacity: element.opacity,
                          zIndex: element.zIndex,
                          ...(element.type === 'text' && {
                            fontSize: element.fontSize,
                            fontWeight: element.fontWeight,
                            color: element.textColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }),
                        }}
                      >
                        {element.type === 'text' && element.content}
                        {element.type === 'image' && element.content === 'Cash or Crash Logo' && (
                          <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
                        )}
                        {element.type === 'image' && element.content !== 'Cash or Crash Logo' && (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            {element.content}
                          </div>
                        )}
                        {element.type === 'box' && element.content && (
                          <div className="text-sm">{element.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <VisualDesigner onDesignChange={handleDesignChange} />
          )}
        </div>
      </div>
    </div>
  );
}
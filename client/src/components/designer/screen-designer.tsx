import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Square, 
  Type, 
  Image as ImageIcon, 
  Move, 
  Eye,
  Code,
  Layers
} from "lucide-react";

export interface DesignElement {
  id: string;
  type: 'box' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
  margin?: number;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  borderRadius?: number;
  opacity?: number;
  zIndex?: number;
}

interface ScreenDesignerProps {
  onDesignChange?: (elements: DesignElement[]) => void;
  initialElements?: DesignElement[];
  frameName?: string;
}

export function ScreenDesigner({ onDesignChange, initialElements = [], frameName }: ScreenDesignerProps) {
  const [elements, setElements] = useState<DesignElement[]>(initialElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    originalX: number;
    originalY: number;
  }>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    originalX: 0,
    originalY: 0,
  });

  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'full'>('desktop');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showRulers, setShowRulers] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<string>(frameName || 'new');
  
  // Color presets for quick selection
  const colorPresets = {
    backgrounds: [
      '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
      '#1e293b', '#0f172a', '#374151', '#1f2937', '#111827',
      '#fef2f2', '#fee2e2', '#fecaca', '#f87171', '#dc2626',
      '#f0fdf4', '#dcfce7', '#bbf7d0', '#4ade80', '#16a34a',
      '#eff6ff', '#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8',
      '#fefce8', '#fef3c7', '#fcd34d', '#f59e0b', '#d97706'
    ],
    text: [
      '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280',
      '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db',
      '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca',
      '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
      '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
      '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'
    ],
    borders: [
      '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151',
      '#fee2e2', '#fecaca', '#f87171', '#ef4444', '#dc2626',
      '#dcfce7', '#bbf7d0', '#4ade80', '#22c55e', '#16a34a',
      '#dbeafe', '#93c5fd', '#3b82f6', '#2563eb', '#1d4ed8',
      '#fef3c7', '#fcd34d', '#f59e0b', '#ea580c', '#d97706'
    ]
  };
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const appFrames = {
    'team-login': {
      name: 'Team Login Page',
      elements: [
        {
          id: 'logo-element',
          type: 'image' as const,
          x: 120,
          y: 60,
          width: 600,
          height: 400,
          content: 'Cash or Crash Logo',
          backgroundColor: 'transparent',
          borderColor: '#d1d5db',
          borderWidth: 0,
          padding: 10,
          margin: 0,
          fontSize: 16,
          fontWeight: 'normal',
          textColor: '#374151',
          borderRadius: 8,
          opacity: 1,
          zIndex: 1,
        },
        {
          id: 'title-element',
          type: 'text' as const,
          x: 80,
          y: 200,
          width: 280,
          height: 50,
          content: 'Team Login',
          backgroundColor: 'transparent',
          borderColor: '#d1d5db',
          borderWidth: 0,
          padding: 10,
          margin: 0,
          fontSize: 32,
          fontWeight: 'bold',
          textColor: '#1f2937',
          borderRadius: 4,
          opacity: 1,
          zIndex: 2,
        },
        {
          id: 'form-box',
          type: 'box' as const,
          x: 60,
          y: 280,
          width: 320,
          height: 200,
          content: 'Login Form Area',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 20,
          margin: 0,
          fontSize: 14,
          fontWeight: 'normal',
          textColor: '#6b7280',
          borderRadius: 8,
          opacity: 1,
          zIndex: 3,
        }
      ]
    },
    'dashboard': {
      name: 'Team Dashboard',
      elements: [
        {
          id: 'header-bar',
          type: 'box' as const,
          x: 0,
          y: 0,
          width: 400,
          height: 60,
          content: 'Dashboard Header',
          backgroundColor: '#1f2937',
          borderColor: '#374151',
          borderWidth: 0,
          padding: 15,
          margin: 0,
          fontSize: 16,
          fontWeight: 'bold',
          textColor: '#ffffff',
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        {
          id: 'nav-tabs',
          type: 'box' as const,
          x: 0,
          y: 60,
          width: 400,
          height: 50,
          content: 'Stocks | Currency | Startup',
          backgroundColor: '#f9fafb',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          margin: 0,
          fontSize: 14,
          fontWeight: 'medium',
          textColor: '#374151',
          borderRadius: 0,
          opacity: 1,
          zIndex: 9,
        },
        {
          id: 'main-content',
          type: 'box' as const,
          x: 20,
          y: 130,
          width: 360,
          height: 300,
          content: 'Trading Desk Content Area',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 20,
          margin: 0,
          fontSize: 14,
          fontWeight: 'normal',
          textColor: '#6b7280',
          borderRadius: 8,
          opacity: 1,
          zIndex: 5,
        }
      ]
    },
    'admin': {
      name: 'Admin Panel',
      elements: [
        {
          id: 'admin-header',
          type: 'box' as const,
          x: 0,
          y: 0,
          width: 400,
          height: 70,
          content: 'Admin Control Panel',
          backgroundColor: '#dc2626',
          borderColor: '#b91c1c',
          borderWidth: 0,
          padding: 20,
          margin: 0,
          fontSize: 18,
          fontWeight: 'bold',
          textColor: '#ffffff',
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        {
          id: 'admin-sidebar',
          type: 'box' as const,
          x: 0,
          y: 70,
          width: 120,
          height: 350,
          content: 'Admin Menu',
          backgroundColor: '#f3f4f6',
          borderColor: '#d1d5db',
          borderWidth: 1,
          padding: 15,
          margin: 0,
          fontSize: 12,
          fontWeight: 'medium',
          textColor: '#374151',
          borderRadius: 0,
          opacity: 1,
          zIndex: 8,
        },
        {
          id: 'admin-content',
          type: 'box' as const,
          x: 140,
          y: 90,
          width: 240,
          height: 310,
          content: 'Management Tools',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 20,
          margin: 0,
          fontSize: 14,
          fontWeight: 'normal',
          textColor: '#6b7280',
          borderRadius: 8,
          opacity: 1,
          zIndex: 6,
        }
      ]
    }
  };

  const getScreenDimensions = useCallback(() => {
    switch (screenSize) {
      case 'mobile': return { width: 375, height: 667 };
      case 'tablet': return { width: 768, height: 1024 };
      case 'desktop': return { width: 1440, height: 900 };
      case 'full': return { width: 1920, height: 1080 };
      default: return { width: 1440, height: 900 };
    }
  }, [screenSize]);

  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Load frame elements when frame selection changes
  const loadFrame = useCallback((frameKey: string) => {
    if (frameKey === 'new') {
      setElements([]);
    } else if (appFrames[frameKey as keyof typeof appFrames]) {
      setElements(appFrames[frameKey as keyof typeof appFrames].elements);
    }
    setSelectedElement(null);
  }, [appFrames]);

  const addElement = useCallback((type: DesignElement['type']) => {
    const newElement: DesignElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : type === 'image' ? 600 : 150,
      height: type === 'text' ? 40 : type === 'image' ? 400 : 100,
      content: type === 'text' ? 'Sample Text' : type === 'image' ? 'Image Placeholder' : '',
      backgroundColor: type === 'box' ? '#f3f4f6' : 'transparent',
      borderColor: '#d1d5db',
      borderWidth: 1,
      padding: 10,
      margin: 0,
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#374151',
      borderRadius: 4,
      opacity: 1,
      zIndex: elements.length + 1,
    };
    
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    setSelectedElement(newElement.id);
    onDesignChange?.(updatedElements);
  }, [elements, onDesignChange]);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(updatedElements);
    onDesignChange?.(updatedElements);
  }, [elements, onDesignChange]);

  const deleteElement = useCallback((id: string) => {
    const updatedElements = elements.filter(el => el.id !== id);
    setElements(updatedElements);
    setSelectedElement(null);
    onDesignChange?.(updatedElements);
  }, [elements, onDesignChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setSelectedElement(elementId);
    setDragState({
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      originalX: element.x,
      originalY: element.y,
    });
  }, [elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.elementId) {
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;
      
      const newX = Math.max(0, dragState.originalX + deltaX);
      const newY = Math.max(0, dragState.originalY + deltaY);
      
      updateElement(dragState.elementId, {
        x: snapToGridValue(newX),
        y: snapToGridValue(newY),
      });
    }
  }, [dragState, updateElement, snapToGridValue]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      originalX: 0,
      originalY: 0,
    });
  }, []);

  const selectedElementData = selectedElement ? elements.find(el => el.id === selectedElement) : null;



  const saveFrameDesign = async () => {
    if (selectedFrame === 'new') {
      alert('Please select an existing frame to save changes to.');
      return;
    }

    try {
      const response = await fetch('/api/save-frame-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameId: selectedFrame,
          elements: elements,
          frameName: appFrames[selectedFrame as keyof typeof appFrames]?.name
        }),
      });

      if (response.ok) {
        alert(`Successfully saved changes to ${appFrames[selectedFrame as keyof typeof appFrames]?.name}!`);
      } else {
        alert('Failed to save frame design. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving frame design. Changes are preserved in this session.');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Design Tools</h3>
        
        {/* Frame Selector */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="frame-select" className="text-sm font-medium">Edit Existing Frame</Label>
          <Select value={selectedFrame} onValueChange={(value) => {
            setSelectedFrame(value);
            loadFrame(value);
          }}>
            <SelectTrigger id="frame-select">
              <SelectValue placeholder="Choose frame to edit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New Design</SelectItem>
              <SelectItem value="team-login">Team Login Page</SelectItem>
              <SelectItem value="dashboard">Team Dashboard</SelectItem>
              <SelectItem value="admin">Admin Panel</SelectItem>
            </SelectContent>
          </Select>
          {selectedFrame !== 'new' && (
            <div className="text-xs text-muted-foreground">
              Editing: {appFrames[selectedFrame as keyof typeof appFrames]?.name}
            </div>
          )}
        </div>

        {/* Save Button */}
        {selectedFrame !== 'new' && (
          <div className="mb-4">
            <Button
              onClick={saveFrameDesign}
              className="w-full"
              variant="default"
            >
              Save Frame Changes
            </Button>
          </div>
        )}

        <Separator className="my-4" />
        
        {/* Element Tools */}
        <div className="space-y-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElement('box')}
            className="w-full justify-start"
          >
            <Square className="w-4 h-4 mr-2" />
            Add Box
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElement('text')}
            className="w-full justify-start"
          >
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElement('image')}
            className="w-full justify-start"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Global Theme Colors */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Color Themes</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                elements.forEach(el => {
                  if (el.type === 'text') {
                    updateElement(el.id, { textColor: '#1f2937', backgroundColor: 'transparent' });
                  } else {
                    updateElement(el.id, { backgroundColor: '#ffffff', borderColor: '#e5e7eb' });
                  }
                });
              }}
              className="text-xs justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                Light Theme
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                elements.forEach(el => {
                  if (el.type === 'text') {
                    updateElement(el.id, { textColor: '#f9fafb', backgroundColor: 'transparent' });
                  } else {
                    updateElement(el.id, { backgroundColor: '#1f2937', borderColor: '#374151' });
                  }
                });
              }}
              className="text-xs justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-800 rounded"></div>
                Dark Theme
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                elements.forEach(el => {
                  if (el.type === 'text') {
                    updateElement(el.id, { textColor: '#1d4ed8', backgroundColor: 'transparent' });
                  } else {
                    updateElement(el.id, { backgroundColor: '#eff6ff', borderColor: '#3b82f6' });
                  }
                });
              }}
              className="text-xs justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
                Blue Theme
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                elements.forEach(el => {
                  if (el.type === 'text') {
                    updateElement(el.id, { textColor: '#dc2626', backgroundColor: 'transparent' });
                  } else {
                    updateElement(el.id, { backgroundColor: '#fef2f2', borderColor: '#ef4444' });
                  }
                });
              }}
              className="text-xs justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
                Cash or Crash Red
              </div>
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Screen Size Controls */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Screen Size</h4>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={screenSize === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScreenSize('mobile')}
              className="text-xs"
            >
              Mobile
            </Button>
            <Button
              variant={screenSize === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScreenSize('tablet')}
              className="text-xs"
            >
              Tablet
            </Button>
            <Button
              variant={screenSize === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScreenSize('desktop')}
              className="text-xs"
            >
              Desktop
            </Button>
            <Button
              variant={screenSize === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScreenSize('full')}
              className="text-xs"
            >
              Full HD
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {getScreenDimensions().width} × {getScreenDimensions().height}px
          </div>
        </div>

        <Separator className="my-4" />

        {/* Grid Controls */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Grid Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Snap to Grid</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRulers}
                onChange={(e) => setShowRulers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Rulers</span>
            </label>
            <div>
              <Label htmlFor="gridSize" className="text-xs">Grid Size</Label>
              <Input
                id="gridSize"
                type="number"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value) || 20)}
                className="h-8 text-xs"
                min="10"
                max="50"
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />


      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="relative bg-white shadow-2xl border border-gray-300"
              style={{
                width: `${getScreenDimensions().width}px`,
                height: `${getScreenDimensions().height}px`,
              }}
            >
              {/* Device Frame Header */}
              <div className="absolute -top-8 left-0 flex items-center gap-4">
                <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
                  {screenSize.charAt(0).toUpperCase() + screenSize.slice(1)} Preview
                </div>
                <div className="text-gray-600 text-sm">
                  {getScreenDimensions().width} × {getScreenDimensions().height}px
                </div>
              </div>
              
              {/* Canvas Area */}
              <div
                ref={canvasRef}
                className="relative w-full h-full bg-white overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px ${gridSize}px`
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => setSelectedElement(null)}
              >
                {/* Grid coordinates overlay */}
                {showRulers && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* X-axis rulers */}
                    {Array.from({ length: Math.floor(getScreenDimensions().width / 100) + 1 }, (_, i) => (
                      <div
                        key={`x-${i}`}
                        className="absolute top-0 h-full border-l border-blue-200"
                        style={{ left: `${i * 100}px` }}
                      >
                        <span className="absolute -top-4 left-1 text-xs text-blue-600 bg-white px-1 rounded">
                          {i * 100}
                        </span>
                      </div>
                    ))}
                    {/* Y-axis rulers */}
                    {Array.from({ length: Math.floor(getScreenDimensions().height / 100) + 1 }, (_, i) => (
                      <div
                        key={`y-${i}`}
                        className="absolute left-0 w-full border-t border-blue-200"
                        style={{ top: `${i * 100}px` }}
                      >
                        <span className="absolute -left-10 top-1 text-xs text-blue-600 bg-white px-1 rounded">
                          {i * 100}
                        </span>
                      </div>
                    ))}
                    
                    {/* Corner indicator */}
                    <div className="absolute top-0 left-0 w-8 h-8 bg-blue-100 border border-blue-200 flex items-center justify-center">
                      <span className="text-xs text-blue-600">0,0</span>
                    </div>
                  </div>
                )}
                
                {/* Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-move select-none ${
                      selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      backgroundColor: element.backgroundColor,
                      border: `${element.borderWidth}px solid ${element.borderColor}`,
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
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(element.id);
                    }}
                  >
                    {element.type === 'text' && element.content}
                    {element.type === 'image' && (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        {element.content}
                      </div>
                    )}
                    {element.type === 'box' && element.content && (
                      <div className="p-2 text-sm">{element.content}</div>
                    )}
                    
                    {/* On-screen X/Y Position Controls */}
                    {selectedElement === element.id && (
                      <>
                        {/* X Position Control */}
                        <div className="absolute -top-8 left-0 flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-sm">
                          <span className="text-xs text-gray-600">X:</span>
                          <button
                            className="px-1 py-0.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newX = prompt("Enter X position:", element.x.toString());
                              if (newX !== null) {
                                updateElement(element.id, { x: parseInt(newX) || 0 });
                              }
                            }}
                          >
                            {element.x}
                          </button>
                        </div>
                        
                        {/* Y Position Control */}
                        <div className="absolute -left-12 top-0 flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-sm">
                          <span className="text-xs text-gray-600">Y:</span>
                          <button
                            className="px-1 py-0.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newY = prompt("Enter Y position:", element.y.toString());
                              if (newY !== null) {
                                updateElement(element.id, { y: parseInt(newY) || 0 });
                              }
                            }}
                          >
                            {element.y}
                          </button>
                        </div>
                        
                        {/* Resize Handles */}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 cursor-sw-resize" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 cursor-ne-resize" />
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 cursor-nw-resize" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElementData && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Properties</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteElement(selectedElementData.id)}
            >
              Delete
            </Button>
          </div>

          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              {/* Position Controls */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="x" className="text-xs">X Position</Label>
                    <div className="flex gap-1">
                      <Input
                        id="x"
                        type="number"
                        value={selectedElementData.x}
                        onChange={(e) => updateElement(selectedElementData.id, { x: parseInt(e.target.value) || 0 })}
                        className="h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newX = prompt("Enter X position:", selectedElementData.x.toString());
                          if (newX !== null) {
                            updateElement(selectedElementData.id, { x: parseInt(newX) || 0 });
                          }
                        }}
                        className="h-8 px-2"
                        title="Manual X entry"
                      >
                        X
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="y" className="text-xs">Y Position</Label>
                    <div className="flex gap-1">
                      <Input
                        id="y"
                        type="number"
                        value={selectedElementData.y}
                        onChange={(e) => updateElement(selectedElementData.id, { y: parseInt(e.target.value) || 0 })}
                        className="h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newY = prompt("Enter Y position:", selectedElementData.y.toString());
                          if (newY !== null) {
                            updateElement(selectedElementData.id, { y: parseInt(newY) || 0 });
                          }
                        }}
                        className="h-8 px-2"
                        title="Manual Y entry"
                      >
                        Y
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Position Presets */}
              <div>
                <Label className="text-xs">Quick Position</Label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { x: 0, y: 0 })}
                  >
                    Top Left
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { 
                      x: Math.floor(getScreenDimensions().width / 2 - selectedElementData.width / 2), 
                      y: 0 
                    })}
                  >
                    Top Center
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { 
                      x: getScreenDimensions().width - selectedElementData.width, 
                      y: 0 
                    })}
                  >
                    Top Right
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { 
                      x: Math.floor(getScreenDimensions().width / 2 - selectedElementData.width / 2), 
                      y: Math.floor(getScreenDimensions().height / 2 - selectedElementData.height / 2) 
                    })}
                  >
                    Center
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { 
                      x: 0, 
                      y: getScreenDimensions().height - selectedElementData.height 
                    })}
                  >
                    Bottom Left
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { 
                      x: Math.floor(getScreenDimensions().width / 2 - selectedElementData.width / 2), 
                      y: getScreenDimensions().height - selectedElementData.height 
                    })}
                  >
                    Bottom Center
                  </Button>
                </div>
              </div>
              {/* Size Controls */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">Width</Label>
                    <div className="flex gap-1">
                      <Input
                        id="width"
                        type="number"
                        value={selectedElementData.width}
                        onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) || 1 })}
                        className="h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newWidth = prompt("Enter width:", selectedElementData.width.toString());
                          if (newWidth !== null) {
                            updateElement(selectedElementData.id, { width: parseInt(newWidth) || 1 });
                          }
                        }}
                        className="h-8 px-2"
                        title="Manual width entry"
                      >
                        W
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height</Label>
                    <div className="flex gap-1">
                      <Input
                        id="height"
                        type="number"
                        value={selectedElementData.height}
                        onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) || 1 })}
                        className="h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHeight = prompt("Enter height:", selectedElementData.height.toString());
                          if (newHeight !== null) {
                            updateElement(selectedElementData.id, { height: parseInt(newHeight) || 1 });
                          }
                        }}
                        className="h-8 px-2"
                        title="Manual height entry"
                      >
                        H
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Presets */}
              <div>
                <Label className="text-xs">Quick Sizes</Label>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { width: 100, height: 50 })}
                  >
                    Small
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { width: 200, height: 100 })}
                  >
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { width: 400, height: 200 })}
                  >
                    Large
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateElement(selectedElementData.id, { width: 600, height: 400 })}
                  >
                    X-Large
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              {/* Background Color */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Background Color</Label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={selectedElementData.backgroundColor}
                      onChange={(e) => updateElement(selectedElementData.id, { backgroundColor: e.target.value })}
                      className="w-12 h-8 p-0 border rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedElementData.backgroundColor}
                      onChange={(e) => updateElement(selectedElementData.id, { backgroundColor: e.target.value })}
                      className="flex-1 text-xs font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {colorPresets.backgrounds.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => updateElement(selectedElementData.id, { backgroundColor: color })}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Color */}
              {selectedElementData.type === 'text' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Text Color</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={selectedElementData.textColor}
                        onChange={(e) => updateElement(selectedElementData.id, { textColor: e.target.value })}
                        className="w-12 h-8 p-0 border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={selectedElementData.textColor}
                        onChange={(e) => updateElement(selectedElementData.id, { textColor: e.target.value })}
                        className="flex-1 text-xs font-mono"
                        placeholder="#000000"
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {colorPresets.text.map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => updateElement(selectedElementData.id, { textColor: color })}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Border Color */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Border Color</Label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={selectedElementData.borderColor}
                      onChange={(e) => updateElement(selectedElementData.id, { borderColor: e.target.value })}
                      className="w-12 h-8 p-0 border rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedElementData.borderColor}
                      onChange={(e) => updateElement(selectedElementData.id, { borderColor: e.target.value })}
                      className="flex-1 text-xs font-mono"
                      placeholder="#e5e7eb"
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {colorPresets.borders.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => updateElement(selectedElementData.id, { borderColor: color })}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Border Width */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="borderWidth" className="text-xs">Border Width</Label>
                  <Input
                    id="borderWidth"
                    type="number"
                    value={selectedElementData.borderWidth}
                    onChange={(e) => updateElement(selectedElementData.id, { borderWidth: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="10"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="borderRadius" className="text-xs">Border Radius</Label>
                  <Input
                    id="borderRadius"
                    type="number"
                    value={selectedElementData.borderRadius}
                    onChange={(e) => updateElement(selectedElementData.id, { borderRadius: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="50"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Opacity */}
              <div>
                <Label htmlFor="opacity" className="text-xs">Opacity</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedElementData.opacity}
                    onChange={(e) => updateElement(selectedElementData.id, { opacity: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round((selectedElementData.opacity || 1) * 100)}%
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  value={selectedElementData.content}
                  onChange={(e) => updateElement(selectedElementData.id, { content: e.target.value })}
                  placeholder={selectedElementData.type === 'text' ? 'Enter text...' : 'Element label...'}
                />
              </div>

              {/* Typography Controls for Text Elements */}
              {selectedElementData.type === 'text' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                      <Input
                        id="fontSize"
                        type="number"
                        value={selectedElementData.fontSize}
                        onChange={(e) => updateElement(selectedElementData.id, { fontSize: parseInt(e.target.value) || 16 })}
                        min="8"
                        max="72"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fontWeight" className="text-xs">Font Weight</Label>
                      <Select
                        value={selectedElementData.fontWeight}
                        onValueChange={(value) => updateElement(selectedElementData.id, { fontWeight: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="semibold">Semibold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Font Style Presets */}
                  <div>
                    <Label className="text-xs">Quick Styles</Label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => updateElement(selectedElementData.id, {
                          fontSize: 32,
                          fontWeight: 'bold',
                          textColor: '#1f2937'
                        })}
                      >
                        Heading
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => updateElement(selectedElementData.id, {
                          fontSize: 16,
                          fontWeight: 'normal',
                          textColor: '#374151'
                        })}
                      >
                        Body Text
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => updateElement(selectedElementData.id, {
                          fontSize: 12,
                          fontWeight: 'medium',
                          textColor: '#6b7280'
                        })}
                      >
                        Caption
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => updateElement(selectedElementData.id, {
                          fontSize: 14,
                          fontWeight: 'semibold',
                          textColor: '#1d4ed8'
                        })}
                      >
                        Link
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Spacing Controls */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="padding" className="text-xs">Padding</Label>
                  <Input
                    id="padding"
                    type="number"
                    value={selectedElementData.padding}
                    onChange={(e) => updateElement(selectedElementData.id, { padding: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="50"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="margin" className="text-xs">Margin</Label>
                  <Input
                    id="margin"
                    type="number"
                    value={selectedElementData.margin}
                    onChange={(e) => updateElement(selectedElementData.id, { margin: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="50"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Z-Index Control */}
              <div>
                <Label htmlFor="zIndex" className="text-xs">Layer Order (Z-Index)</Label>
                <Input
                  id="zIndex"
                  type="number"
                  value={selectedElementData.zIndex}
                  onChange={(e) => updateElement(selectedElementData.id, { zIndex: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="100"
                  className="h-8"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
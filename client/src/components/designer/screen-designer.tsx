import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

export function ScreenDesigner({ onDesignChange }: ScreenDesignerProps) {
  const [elements, setElements] = useState<DesignElement[]>([]);
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
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'code'>('design');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'full'>('desktop');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showRulers, setShowRulers] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const addElement = useCallback((type: DesignElement['type']) => {
    const newElement: DesignElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 40 : 100,
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

  const generateCode = () => {
    const code = elements.map(el => {
      const styles = {
        position: 'absolute',
        left: `${el.x}px`,
        top: `${el.y}px`,
        width: `${el.width}px`,
        height: `${el.height}px`,
        backgroundColor: el.backgroundColor,
        border: `${el.borderWidth}px solid ${el.borderColor}`,
        borderRadius: `${el.borderRadius}px`,
        padding: `${el.padding}px`,
        margin: `${el.margin}px`,
        opacity: el.opacity,
        zIndex: el.zIndex,
        ...(el.type === 'text' && {
          fontSize: `${el.fontSize}px`,
          fontWeight: el.fontWeight,
          color: el.textColor,
        }),
      };

      return `<div style={${JSON.stringify(styles, null, 2)}}>${el.content || ''}</div>`;
    }).join('\n');

    return `<div style={{ position: 'relative', width: '100%', height: '100%' }}>\n${code}\n</div>`;
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Design Tools</h3>
        
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

        {/* View Mode Toggle */}
        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-medium">View Mode</h4>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'design' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('design')}
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('code')}
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          {viewMode === 'design' && (
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
                      
                      {/* Resize Handles */}
                      {selectedElement === element.id && (
                        <>
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
          )}

          {viewMode === 'preview' && (
            <div className="flex items-center justify-center min-h-full">
              <div
                className="relative bg-white shadow-2xl border border-gray-300"
                style={{
                  width: `${getScreenDimensions().width}px`,
                  height: `${getScreenDimensions().height}px`,
                }}
              >
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className="absolute"
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'code' && (
            <div className="p-4">
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
                {generateCode()}
              </pre>
            </div>
          )}
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="x">X Position</Label>
                  <Input
                    id="x"
                    type="number"
                    value={selectedElementData.x}
                    onChange={(e) => updateElement(selectedElementData.id, { x: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="y">Y Position</Label>
                  <Input
                    id="y"
                    type="number"
                    value={selectedElementData.y}
                    onChange={(e) => updateElement(selectedElementData.id, { y: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={selectedElementData.width}
                    onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={selectedElementData.height}
                    onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={selectedElementData.backgroundColor}
                  onChange={(e) => updateElement(selectedElementData.id, { backgroundColor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="borderColor">Border Color</Label>
                <Input
                  id="borderColor"
                  type="color"
                  value={selectedElementData.borderColor}
                  onChange={(e) => updateElement(selectedElementData.id, { borderColor: e.target.value })}
                />
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
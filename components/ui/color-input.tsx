"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isGradient, extractFirstColorFromGradient, getTagColorStyle } from "@/lib/tag-color-utils";

interface ColorInputProps {
    value?: string;
    onChange?: (color: string) => void;
    disabled?: boolean;
    className?: string;
    presetColors?: string[];
}

const DEFAULT_PRESET_COLORS = [
    "#6b7280", "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6",
    "#ec4899", "#f43f5e", "#84cc16", "#10b981",
    "#14b8a6", "#f59e0b", "#8b5a2b", "#6366f1"
];

const GRADIENT_PRESETS = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
];

function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function ColorInput({
    value = "#6b7280",
    onChange,
    disabled = false,
    className,
    presetColors = DEFAULT_PRESET_COLORS
}: ColorInputProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [customColor, setCustomColor] = React.useState(value);
    const [selectedTab, setSelectedTab] = React.useState("presets");

    React.useEffect(() => {
        // Only update custom color if current value is a valid hex color
        if (isValidHexColor(value)) {
            setCustomColor(value);
        } else if (isGradient(value)) {
            // Extract first color from gradient for custom tab
            setCustomColor(extractFirstColorFromGradient(value));
        } else {
            setCustomColor("#6b7280");
        }
    }, [value]);

    const handleColorChange = (color: string) => {
        onChange?.(color);
    };

    const handleCustomColorChange = (inputValue: string) => {
        setCustomColor(inputValue);
        if (isValidHexColor(inputValue)) {
            handleColorChange(inputValue);
        }
    };

    const handleCustomColorBlur = () => {
        if (!isValidHexColor(customColor)) {
            if (isValidHexColor(value)) {
                setCustomColor(value);
            } else if (isGradient(value)) {
                setCustomColor(extractFirstColorFromGradient(value));
            } else {
                setCustomColor("#6b7280");
            }
        }
    };

    const getCurrentColorForNativeInput = () => {
        if (isValidHexColor(value)) {
            return value;
        } else if (isGradient(value)) {
            return extractFirstColorFromGradient(value);
        }
        return "#6b7280";
    };

    const renderCurrentColorPreview = () => (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-md border-2 border-background shadow-sm flex-shrink-0"
                    style={getTagColorStyle(value)}
                />
                <div>
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="text-sm font-mono">
                        {isGradient(value) ? 'Gradient' : value}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn("flex gap-2", className)}>
            {/* Color Preview Button */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className="w-12 h-10 p-0 border-2 hover:scale-105 transition-transform overflow-hidden"
                        style={getTagColorStyle(value)}
                    >
                        <span className="sr-only">Select color</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[min(calc(100vw-2rem),20rem)] p-0"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    avoidCollisions={true}
                >
                    <div className="flex flex-col max-h-[80vh]">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 rounded-t-lg rounded-b-none border-b">
                                <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
                                <TabsTrigger value="gradients" className="text-xs">Gradients</TabsTrigger>
                                <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                            </TabsList>

                            {/* Current Color Preview - Shows at top of each tab */}
                            <div className="p-3 border-b bg-muted/10">
                                {renderCurrentColorPreview()}
                            </div>

                            {/* Preset Colors */}
                            <TabsContent value="presets" className="p-3 m-0 max-h-60 overflow-y-auto">
                                <div className="grid grid-cols-4 gap-2">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => {
                                                handleColorChange(color);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 relative",
                                                value === color
                                                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                                                    : "border-border/50 hover:border-border"
                                            )}
                                            style={{ backgroundColor: color }}
                                        >
                                            {value === color && (
                                                <Check className="w-4 h-4 text-white mx-auto drop-shadow-lg absolute inset-0 m-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Gradient Presets */}
                            <TabsContent value="gradients" className="p-3 m-0 max-h-60 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {GRADIENT_PRESETS.map((gradient, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                handleColorChange(gradient);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "h-12 rounded-lg border-2 transition-all hover:scale-105 relative",
                                                value === gradient
                                                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                                                    : "border-border/50 hover:border-border"
                                            )}
                                            style={{ background: gradient }}
                                        >
                                            {value === gradient && (
                                                <Check className="w-4 h-4 text-white mx-auto drop-shadow-lg absolute inset-0 m-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Custom Color */}
                            <TabsContent value="custom" className="p-3 m-0 max-h-60 overflow-y-auto">
                                <div className="space-y-3">
                                    {isGradient(value) && (
                                        <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                                Gradient selected. Use the color picker to choose a solid color instead.
                                            </p>
                                        </div>
                                    )}

                                    {/* HTML Color Input */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block text-foreground">Color Picker</label>
                                        <input
                                            type="color"
                                            value={getCurrentColorForNativeInput()}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                            className="w-full h-12 rounded-lg border border-border cursor-pointer bg-background"
                                        />
                                    </div>

                                    {/* Hex Input */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block text-foreground">Hex Code</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={customColor}
                                                onChange={(e) => handleCustomColorChange(e.target.value)}
                                                onBlur={handleCustomColorBlur}
                                                placeholder="#000000"
                                                className="font-mono"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => setIsOpen(false)}
                                                disabled={!isValidHexColor(customColor)}
                                                className="px-3"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                        {!isValidHexColor(customColor) && customColor && (
                                            <p className="text-xs text-destructive mt-1">Invalid hex color</p>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Current Color Display */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Current color</div>
                <div className="text-sm font-mono truncate text-foreground">
                    {isGradient(value) ? 'Gradient' : value}
                </div>
            </div>
        </div>
    );
}

export { ColorInput };
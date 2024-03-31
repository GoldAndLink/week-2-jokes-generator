export interface Topic {
    label: string;
    value: string;
}

export interface Tone {
    label: string;
    value: string;
}

export interface JokeType {
    label: string;
    value: string;
}

export interface Parameters {
  selectedTopic: string | null;
  selectedTone: string | null;
  selectedJokeType: string | null;
  shouldRenderParameters: boolean;
  temperature: number;
}

export interface DropdownProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export interface TemperatureSliderProps {
  temperature: number;
  setTemperature: (value: number) => void;
}

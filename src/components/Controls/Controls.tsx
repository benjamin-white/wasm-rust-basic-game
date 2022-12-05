type ControlsProps = {
  handleClick: () => void;
  buttonText: string;
}

const Controls = ({ handleClick, buttonText }: ControlsProps) =>
  <button onClick={handleClick}>{buttonText}</button>

export default Controls
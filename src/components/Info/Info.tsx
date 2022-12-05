import styles from './Info.module.css'

type InfoProps = {
  statusText: String;
  points: number;
}

const Info = ({ statusText, points }: InfoProps) =>
  <div className={styles.Info}>
    <p><strong>{statusText}</strong></p>
    <p>Points: {points}</p>
  </div>

export default Info

import styles from "./PersonalProfilePanel.module.css";

export function PersonalProfilePanel(props: any): JSX.Element
{
    return (
        <div className={styles.mainContainer}>
            <a href="https://www.linkedin.com/in/andrei-ciucaru-411710284/" target="_blank"
            className={styles.bgImage + ' ' + styles.linkedInLink}></a>


            <a href="https://github.com/aciucaru/" target="_blank"
            className={styles.bgImage + ' ' + styles.gitHubLink}></a>
        </div>
    );
}
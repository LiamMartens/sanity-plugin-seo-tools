import * as React from 'react';
import styles from './style.scss';
import { Valid } from './Valid';

interface IProps {
    valid?: boolean;
    warning?: boolean;
}

export class Result extends React.Component<IProps> {
    public render() {
        const { valid, warning, children } = this.props;

        return (
            <div className={styles.result}>
                <p className={styles.icon}><Valid valid={valid} warning={warning} /></p>
                <p className={styles.name}>
                    {typeof children === 'function' ? (
                        children(valid)
                    ) : (
                        children
                    )}
                </p>
            </div>
        )
    }
}
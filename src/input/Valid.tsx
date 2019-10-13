import * as React from 'react';

interface IProps {
    valid?: boolean;
    warning?: boolean;
}

export class Valid extends React.Component<IProps> {
    public render() {
        const { valid, warning } = this.props;

        if (warning) {
            return (
                <>🚩</>
            );
        }

        if (valid) {
            return (
                <>&#9989;</>
            );
        }

        return (
            <>&#10060;</>
        );
    }
}
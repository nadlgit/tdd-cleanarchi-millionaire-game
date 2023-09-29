export const Pyramid = () => (
  <div className="pyramid">
    <PyramidStep label="1 MILLION €" isMilestone />
    <PyramidStep label="300 000 €" />
    <PyramidStep label="150 000 €" />
    <PyramidStep label="100 000 €" />
    <PyramidStep label="72 000 €" />
    <PyramidStep label="48 000 €" isMilestone />
    <PyramidStep label="24 000 €" />
    <PyramidStep label="12 000 €" />
    <PyramidStep label="6 000 €" />
    <PyramidStep label="3 000 €" />
    <PyramidStep label="1 500 €" isMilestone />
    <PyramidStep label="800 €" />
    <PyramidStep label="500 €" />
    <PyramidStep label="300 €" isCurrent />
    <PyramidStep label="200 €" />
  </div>
);

const PyramidStep = ({
  label,
  isMilestone,
  isCurrent,
}: {
  label: string;
  isMilestone?: boolean;
  isCurrent?: boolean;
}) => (
  <p
    className={
      'pyramid-step' +
      (isMilestone ? ' pyramid-milestone' : '') +
      (isCurrent ? ' pyramid-current' : '')
    }
  >
    {label}
  </p>
);

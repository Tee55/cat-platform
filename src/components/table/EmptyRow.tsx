interface EmptyRowProps {
  paginated: unknown[];
  ITEMS_PER_PAGE: number;
}

const EmptyRow = (props: EmptyRowProps) => {
  const { paginated, ITEMS_PER_PAGE } = props;
  return (
    <>
      {[...Array(Math.max(0, ITEMS_PER_PAGE - paginated.length))].map(
        (_, i) => (
          <tr className="" key={`empty-${i}`}>
            <td className="py-1">&nbsp;</td>
            <td></td>
            <td></td>
          </tr>
        )
      )}
    </>
  );
};
export default EmptyRow;

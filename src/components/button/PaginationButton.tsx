interface PaginationButtonProps {
  currentInfoPage: number;
  totalInfoPage: number;
  setCurrentInfoPage: (page: number) => void;
}

export const PaginationButton = (props: PaginationButtonProps) => {
  const { currentInfoPage, totalInfoPage, setCurrentInfoPage } = props;
  return (
    <>
      <button
        type="button"
        onClick={() => setCurrentInfoPage(Math.max(currentInfoPage - 1, 1))}
        disabled={currentInfoPage === 1}
        className="px-3 py-1 rounded border-2 disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {currentInfoPage} of {totalInfoPage}
      </span>
      <button
        type="button"
        onClick={() =>
          setCurrentInfoPage(Math.min(currentInfoPage + 1, totalInfoPage))
        }
        disabled={currentInfoPage === totalInfoPage}
        className="px-3 py-1 rounded border-2 disabled:opacity-50"
      >
        Next
      </button>
    </>
  );
};

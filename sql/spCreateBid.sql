SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Kib Reed
-- Create date: 2022/12/12
-- Description:	Pass name of ITB and estimator's first and last names
-- =============================================
DROP PROCEDURE IF EXISTS spCreateBid;
GO
CREATE PROCEDURE spCreateBid
	-- Add the parameters for the stored procedure here
	@bidName nvarchar(75), 
	@estimatorFirst nvarchar(50),
	@estimatorLast nvarchar(50),
	@bidNo int output
AS
BEGIN
	DECLARE	@newUID int, 
		@bidPageUID int,
		@empUID int,
		@existingUID int
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	set @empUID = (SELECT top 1 Employees.UID
	from Employees
	where Employees.FirstName = @estimatorFirst
	and Employees.LastName = @estimatorLast)
	
	IF @empUID is null
		RETURN 1

	set @existingUID = (select Bids.UID
	from Bids
	where Bids.JobName = @bidName)

	if @existingUID is not null
		return 4
	
	set @bidNo=(SELECT NextBidNo 
		FROM Settings)
	exec USP_GetNextBidNo @desiredBidNo=@bidNo output

	INSERT INTO Bids (
		[BidProjectUID], [ParentBidUID], [OrigBidProjectUID], [OrigParentBidUID], [JobStatusUID], 
		[EstimatorUID], [PrManagerUID], [JobSiteManagerUID], [SourceBidUID], [ExternalID], 
		[QuickBidDB], [BidNo], [BidType], [JobID], [JobName], 
		[ImageFolder], [IsAccepted], [RecalcNeeded], [CreateDateTime], [ModDateTime], 
		[PriceUsing], [PriceUsingDatabase], [PriceUsingWorksheet], [TakeoffIncrements], [HoursPerDay], 
		[MeasureBase], [WeekStartDay], [QuantitiesInLegend], [JobSendRec], [ScaleStyle], 
		[IsCustomScale], [ScaleFactor1], [ScaleFactor2], [PageScale], [PageWidth], 
		[PageHeight], [LastReceiveDateTime], [LastSendDateTime], [DeliverEntireBid], [EstimatedDays], 
		[Percent], [ProjectOver], [DPCMode], [IsDPCUpdated], [IgnoreBidAreas], 
		[SendImageFiles], [HasSTSClash], [SRPending], [IsUnlocked], [FullBidSent], 
		[TypicalType], [GUID], [BidDate], [CopyFromBidNO], [CopyTimestamp], 
		[CoverSheetSelItemType], [CoverSheetSelItemUID], [LegendFlags], [IsCalculatedForSlope], [IsCalculatedForLaborCostCodeTotals], 
		[AutonamingMode], [Notes]
	) 
	VALUES 
	(
		NULL, NULL, NULL, NULL, 1, 
		@empUID, NULL, NULL, NULL, NULL, 
		NULL, @bidNo, 0, NULL, @bidName, 
		NULL, NULL, NULL, (SELECT GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time'), NULL, 
		0, NULL, NULL, 1, 8, 
		0, 0, NULL, NULL, 1, 
		0, 0.125, 12, 0, 42, 
		30, NULL, NULL, NULL, 0, 
		0, 0, 0, NULL, 0, 
		NULL, NULL, NULL, NULL, NULL, 
		0, concat('{',NEWID(), '}'), (SELECT GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time'), NULL, NULL, 
		0, -1, 41, NULL, NULL, 
		NULL, 0x
	)

	set @newUID = (SELECT CAST(@@IDENTITY as int))

	IF @newUID is null
		return 2

	INSERT INTO BidPages (
		[BidUID], [BidPageFolderUID], [Name], 
		[ImagePath], [OverlayImagePath], 
		[Show], [RasterDrawMethod], [ScaleStyle], 
		[IsCustomScale], [ScaleFactor1], 
		[ScaleFactor2], [Scale], [Width], 
		[Height], [ZoomFac], [CurrentX], 
		[CurrentY], [FlipX], [FlipY], [Rotation], 
		[DeskewRotation], [OverlayOffsetX], 
		[OverlayOffsetY], [OverlayRotation], 
		[MultiPageCount], [Index1], [Sequence], 
		[Invert], [Bitonal], [DigitizerNX1], 
		[DigitizerNY1], [DigitizerNX2], 
		[DigitizerNY2], [DigitizerWidth], 
		[DigitizerHeight], [DigitizerResX], 
		[DigitizerResY], [WasSent], [MasterPageUID], 
		[TypicalPageRepeats], [GUID], [OverlayRect], 
		[OverlayResized], [DeskewRotationOverlay], 
		[ZoomFlag], [EasySetup], [SheetNo], 
		[SheetNoPos], [SheetNamePos], [ANSession], 
		[ANToken], [ANFileID]
	) 
	VALUES 
	(
		@newUID, NULL, 'Page 1', NULL, NULL, 0, 1, 1, 
		0, 0.125, 12, NULL, 42, 30, NULL, NULL, 
		NULL, NULL, NULL, NULL, NULL, NULL, 
		NULL, NULL, NULL, 0, 1, NULL, NULL, NULL, 
		NULL, NULL, NULL, NULL, NULL, NULL, 
		NULL, NULL, NULL, NULL, NULL, 
		NULL, NULL, NULL, NULL, 0, '00001', 
		NULL, NULL, NULL, NULL, NULL
	)

	set @bidPageUID = (SELECT CAST(@@IDENTITY as int))

	if @bidPageUID is null
		return 3

	INSERT INTO BidSettings ([BidUID], [BidPageSelectedUID], [STSGUID], [STSServerName], [STSClientName])  VALUES ( @newUID, @bidPageUID, NULL, NULL, NULL)

	INSERT INTO BidLegends ([BidUID], [BidPageUID], [Rotation], [FontName], [FontColor], [FontSize], [FontBold], [FontItalic], [FontUnderline], [IsShowTotals], [MoveToCorner])  VALUES ( @newUID, @bidPageUID, 0, 'Arial', 0, 12, 0, 0, 0, 0, 1)

END
GO

GRANT EXECUTE ON spCreateBid  
    TO public;
GO

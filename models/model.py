"""
Image2Biomass: Patch-based U-Net regressor for biomass (t/ha) from multispectral imagery.
"""
import torch
import torch.nn as nn


class ConvBlock(nn.Module):
    def __init__(self, in_c, out_c):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.conv(x)


class UpBlock(nn.Module):
    def __init__(self, in_c, out_c):
        super().__init__()
        self.up = nn.ConvTranspose2d(in_c, out_c, 2, stride=2)
        self.conv = ConvBlock(in_c, out_c)

    def forward(self, x, skip):
        x = self.up(x)
        x = torch.cat([x, skip], dim=1)
        return self.conv(x)


class UNetRegressor(nn.Module):
    """
    U-Net style encoder-decoder for per-pixel biomass regression (t/ha).
    Input: C x H x W multispectral (e.g. B, G, R, NIR or indices)
    Output: H x W regression map
    """

    def __init__(self, in_ch=4, base=32):
        super().__init__()
        self.enc1 = ConvBlock(in_ch, base)
        self.pool = nn.MaxPool2d(2)
        self.enc2 = ConvBlock(base, base * 2)
        self.enc3 = ConvBlock(base * 2, base * 4)
        self.bottleneck = ConvBlock(base * 4, base * 8)
        self.up3 = UpBlock(base * 8, base * 4)
        self.up2 = UpBlock(base * 4, base * 2)
        self.up1 = UpBlock(base * 2, base)
        self.out = nn.Conv2d(base, 1, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        b = self.bottleneck(self.pool(e3))
        d3 = self.up3(b, e3)
        d2 = self.up2(d3, e2)
        d1 = self.up1(d2, e1)
        out = self.out(d1)
        return out.squeeze(1)  # HxW regression map
